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
  CLAIM_TYPE,
  HOURS_SPEND_CLAIM,
  LEVEL_CLAIM,
  POINT_REWARD,
} from 'src/utils/constants';
import { ReferralService } from 'src/referral/referral.service';

@Injectable()
export class ClaimService {
  constructor(
    @InjectRepository(ClaimEntity)
    private readonly claimRepository: Repository<ClaimEntity>,
    private readonly userService: UserService,
    private readonly referralService: ReferralService,
  ) {}

  async isClaimAvaible(userId: string) {
    const latestClaim = await this.claimRepository
      .createQueryBuilder('claim')
      .where('claim.userId = :userId', { userId })
      .orderBy('claim.updatedAt', 'ASC')
      .getOne();

    if (!latestClaim) {
      return true;
    }

    return (
      new Date().getTime() -
        (latestClaim?.updatedAt.getTime() + 7 * 60 * 60 * 1000) >
      HOURS_SPEND_CLAIM
    );
  }

  async claim(userId: string) {
    const [user, usersReferral] = await Promise.all([
      this.userService.findOne({ id: userId }),
      this.referralService.getUserReferrers(userId),
    ]);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isClaim = await this.isClaimAvaible(user.id);

    if (!isClaim) {
      throw new BadRequestException('not_enough_time_to_claim');
    }

    const claimPromises: Promise<any>[] = [];

    claimPromises.push(
      this.claimRepository.save({
        typeClaim: CLAIM_TYPE.CLAIM_FOR_ME,
        userId: user.id,
        point: POINT_REWARD * LEVEL_CLAIM.LEVEL_ONE,
      }),
    );

    if (usersReferral?.userRedirect) {
      claimPromises.push(
        this.claimRepository.save({
          typeClaim: CLAIM_TYPE.CLAIM_FOR_DIRECT_REF,
          userId: usersReferral.userRedirect,
          point: POINT_REWARD * LEVEL_CLAIM.LEVEL_TWO,
        }),
      );
    }

    if (usersReferral?.userInRedirect) {
      claimPromises.push(
        this.claimRepository.save({
          typeClaim: CLAIM_TYPE.CLAIM_FOR_IN_DIRECT_REF,
          userId: usersReferral.userInRedirect,
          point: POINT_REWARD * LEVEL_CLAIM.LEVEL_THREE,
        }),
      );
    }

    await Promise.all(claimPromises);
  }
}