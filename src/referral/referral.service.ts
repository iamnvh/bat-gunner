import { Injectable } from '@nestjs/common';
import { ReferralEntity } from './referral.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LIMIT_REFERRAL } from 'src/utils/constants';
import { PageDto } from 'src/utils/dto/page.dto';

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(ReferralEntity)
    private readonly referralRepository: Repository<ReferralEntity>,
  ) {}

  async create(referral: ReferralEntity): Promise<ReferralEntity> {
    return this.referralRepository.save(referral);
  }

  async checkLimitReferral(userId: string): Promise<boolean> {
    const count = await this.referralRepository.count({
      where: { referrerUserId: userId },
    });

    return count < LIMIT_REFERRAL;
  }

  async friends(params: PageDto & { userId: string }) {
    const [friends, totalFriends] = await Promise.all([
      this.referralRepository
        .createQueryBuilder('ref')
        .leftJoin('user', 'user', 'user.id = ref.referredUserId')
        .leftJoin('claim', 'claim', 'claim.userId = user.id')
        .where('ref.referrerUserId = :referrerUserId', {
          referrerUserId: params.userId,
        })
        .offset(params.offset)
        .limit(params.limit)
        .select([
          'user.telegramId as "telegramId"',
          'SUM(claim.point) as "totalPoints"',
        ])
        .groupBy('user.telegramId')
        .getRawMany(),
      this.referralRepository
        .createQueryBuilder('ref')
        .where('ref.referrerUserId = :referrerUserId', {
          referrerUserId: params.userId,
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
