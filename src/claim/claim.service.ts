import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClaimEntity } from './claim.entity';
import { UserService } from 'src/user/user.service';
import {
  ClaimType,
  HOURS_SPEND_CLAIM,
  LevelClaimType,
} from 'src/utils/constants';
import { ReferralService } from 'src/referral/referral.service';
import { ClaimDto } from './dto/claim.dto';
import { UserBoostService } from 'src/user-boost/user-boost.service';

@Injectable()
export class ClaimService {
  constructor(
    @InjectRepository(ClaimEntity)
    private readonly claimRepository: Repository<ClaimEntity>,
    private readonly userService: UserService,
    private readonly referralService: ReferralService,
    private readonly userBoostService: UserBoostService,
  ) {}

  async create(claim: ClaimDto): Promise<ClaimEntity> {
    return this.claimRepository.save(claim);
  }

  async isClaimAvailable(userId: string): Promise<boolean> {
    const latestClaimed = await this.claimRepository
      .createQueryBuilder('claim')
      .where('claim.userId = :userId', { userId })
      .andWhere('claim.typeClaim = :typeClaim', {
        typeClaim: ClaimType.CLAIM_FOR_ME,
      })
      .orderBy('claim.updatedAt', 'DESC')
      .getOne();

    if (!latestClaimed) {
      return true;
    }

    const now = new Date().getTime();
    const lastUpdated = latestClaimed.updatedAt.getTime();

    return now - lastUpdated > HOURS_SPEND_CLAIM;
  }

  async claim(userId: string) {
    const [user, usersReferral, boost] = await Promise.all([
      this.userService.findOne({ id: userId }),
      this.referralService.getUserReferrers(userId),
      this.userBoostService.getBoostById(userId),
    ]);

    if (!user || !boost) {
      throw new UnauthorizedException();
    }

    const isClaim = await this.isClaimAvailable(user.id);

    if (!isClaim) {
      throw new BadRequestException('not_enough_time_to_claim');
    }

    const claimPromises: Promise<any>[] = [];
    const pointReward = boost?.rate;

    claimPromises.push(
      this.create({
        typeClaim: ClaimType.CLAIM_FOR_ME,
        userId: user.id,
        point: pointReward * LevelClaimType.LEVEL_ONE,
      }),
    );

    if (usersReferral?.userRedirect) {
      claimPromises.push(
        this.create({
          typeClaim: ClaimType.CLAIM_FOR_DIRECT_REF,
          userId: usersReferral.userRedirect,
          point: pointReward * LevelClaimType.LEVEL_TWO,
        }),
      );
    }

    if (usersReferral?.userInRedirect) {
      claimPromises.push(
        this.create({
          typeClaim: ClaimType.CLAIM_FOR_IN_DIRECT_REF,
          userId: usersReferral.userInRedirect,
          point: pointReward * LevelClaimType.LEVEL_THREE,
        }),
      );
    }

    await Promise.all(claimPromises);
  }
}
