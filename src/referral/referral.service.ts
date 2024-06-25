import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ReferralEntity } from './referral.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LIMIT_REFERRAL } from 'src/utils/constants';
import { EntityCondition } from 'src/utils/types/entity-condition.type';

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(ReferralEntity)
    private readonly referralRepository: Repository<ReferralEntity>,
  ) {}

  findOne(fields: EntityCondition<ReferralEntity>) {
    return this.referralRepository.findOne({
      where: fields,
    });
  }

  async create(referral: ReferralEntity): Promise<ReferralEntity> {
    return this.referralRepository.save(referral);
  }

  async checkLimitReferral(userId: string): Promise<boolean> {
    const count = await this.referralRepository.count({
      where: { referrerUserId: userId },
    });

    return count < LIMIT_REFERRAL;
  }

  async friends(userId: string) {
    const [friends, totalFriends] = await Promise.all([
      this.referralRepository
        .createQueryBuilder('ref')
        .leftJoin('user', 'user', 'user.id = ref.referredUserId')
        .leftJoin('claim', 'claim', 'claim.userId = user.id')
        .where('ref.referrerUserId = :referrerUserId', {
          referrerUserId: userId,
        })
        .select([
          'user.telegramUsername as "userName"',
          'SUM(claim.point) as "totalPoints"',
        ])
        .groupBy('user.telegramUsername')
        .getRawMany(),
      this.referralRepository
        .createQueryBuilder('ref')
        .where('ref.referrerUserId = :referrerUserId', {
          referrerUserId: userId,
        })
        .getCount(),
    ]);

    return { friends, totalFriends };
  }

  async getUserReferrers(userId: string) {
    return this.referralRepository
      .createQueryBuilder('referral')
      .leftJoinAndMapOne(
        'referral.indirectReferral',
        ReferralEntity,
        'indirectReferral',
        'indirectReferral.referredUserId = referral.referrerUserId',
      )
      .where('referral.referredUserId = :userId', { userId })
      .select([
        'referral.referrerUserId as "userRedirect"',
        'indirectReferral.referrerUserId as "userInRedirect"',
      ])
      .getRawOne();
  }
}
