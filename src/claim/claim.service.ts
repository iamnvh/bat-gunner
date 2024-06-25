import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClaimEntity } from './claim.entity';
import { UserService } from 'src/user/user.service';
import { CLAIM_TYPE, LEVEL_CLAIM, POINT_REWARD } from 'src/utils/constants';

@Injectable()
export class ClaimService {
  constructor(
    @InjectRepository(ClaimEntity)
    private readonly claimRepository: Repository<ClaimEntity>,
    private readonly userService: UserService,
  ) {}

  async claim(userId: string) {
    const [user, userDirectReferral] = await Promise.all([
      this.userService.findOne({ id: userId }),
      this.userService.getUserReferrer(userId),
    ]);

    if (!user || !userDirectReferral) {
      throw new UnauthorizedException();
    }

    const userIndirectReferral = await this.userService.getUserReferrer(
      userDirectReferral?.id,
    );

    if (!userIndirectReferral) {
      throw new UnauthorizedException();
    }

    const claimUser = this.claimRepository.save({
      typeClaim: CLAIM_TYPE.CLAIM_FOR_ME,
      userId: user.id,
      point: POINT_REWARD * LEVEL_CLAIM.LEVEL_ONE,
    });

    const claimUserDirect = this.claimRepository.save({
      typeClaim: CLAIM_TYPE.CLAIM_FOR_DIRECT_REF,
      userId: userDirectReferral.id,
      point: POINT_REWARD * LEVEL_CLAIM.LEVEL_TWO,
    });

    const claimUserInDirect = this.claimRepository.save({
      typeClaim: CLAIM_TYPE.CLAIM_FOR_IN_DIRECT_REF,
      userId: userIndirectReferral.id,
      point: POINT_REWARD * LEVEL_CLAIM.LEVEL_THREE,
    });

    await Promise.all([claimUser, claimUserDirect, claimUserInDirect]);

    return claimUser;
  }
}
