import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { CLAIM_TYPE, LEVEL_CLAIM, POINT_REWARD } from 'src/utils/constants';
import { ReferralService } from 'src/referral/referral.service';
import { ClaimService } from 'src/claim/claim.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly referralService: ReferralService,
    private readonly claimService: ClaimService,
  ) {}

  findOne(fields: EntityCondition<UserEntity>) {
    return this.userRepository.findOne({
      where: fields,
    });
  }

  create(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  getProfile(params: { telegramId: string; telegramUsername: string }) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoin('claim', 'claim', 'claim.userId = user.id')
      .where('user.telegramId = :telegramId', { telegramId: params.telegramId })
      .andWhere('user.telegramUsername = :telegramUsername', {
        telegramUsername: params.telegramUsername,
      })
      .select([
        'user.telegramId as telegramId',
        'user.telegramUsername as telegramUsername',
        'SUM(claim.point) as totalPoints',
        'MAX(claim.updatedAt) as lastClaimed',
      ])
      .groupBy('user.id')
      .getRawOne();
  }

  async getUserReferrer(userId: string) {
    const referrer = await this.referralService.findOne({
      referredUserId: userId,
    });

    if (!referrer) {
      throw new UnauthorizedException();
    }

    return this.findOne({ id: referrer.referrerUserId });
  }

  async findUser(params: { telegramId?: string; telegramUsername?: string }) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.telegramId = :telegramId', { telegramId: params.telegramId })
      .orWhere('user.telegramUsername = :telegramUsername', {
        telegramUsername: params.telegramUsername,
      })
      .getOne();
  }

  async claim(userId: string) {
    const [user, userDirectReferral] = await Promise.all([
      this.userRepository.findOne({ where: { id: userId } }),
      this.getUserReferrer(userId),
    ]);

    if (!user || !userDirectReferral) {
      throw new UnauthorizedException();
    }

    const userIndirectReferral = await this.getUserReferrer(
      userDirectReferral?.id,
    );

    if (!userIndirectReferral) {
      throw new UnauthorizedException();
    }

    const claimUser = this.claimService.create({
      typeClaim: CLAIM_TYPE.CLAIM_FOR_ME,
      userId: user.id,
      point: POINT_REWARD * LEVEL_CLAIM.LEVEL_ONE,
    });

    const claimUserDirect = this.claimService.create({
      typeClaim: CLAIM_TYPE.CLAIM_FOR_DIRECT_REF,
      userId: userDirectReferral.id,
      point: POINT_REWARD * LEVEL_CLAIM.LEVEL_TWO,
    });

    const claimUserInDirect = this.claimService.create({
      typeClaim: CLAIM_TYPE.CLAIM_FOR_IN_DIRECT_REF,
      userId: userIndirectReferral.id,
      point: POINT_REWARD * LEVEL_CLAIM.LEVEL_THREE,
    });

    await Promise.all([claimUser, claimUserDirect, claimUserInDirect]);

    return claimUser;
  }
}
