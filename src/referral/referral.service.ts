import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ReferralEntity } from './referral.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LIMIT_REFERRAL } from 'src/utils/constants';

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(ReferralEntity)
    private referralRepository: Repository<ReferralEntity>,
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

  async friends(userId: string) {
    const friends = await this.referralRepository
      .createQueryBuilder('ref')
      .leftJoin('user', 'user', 'user.id = ref.referredUserId')
      .where('ref.referrerUserId = :referrerUserId', {
        referrerUserId: userId,
      })
      .select([
        'user.telegramUsername as displayName',
        'user.totalPoints as totalPoints',
      ])
      .getRawMany();

    const totalFriends = await this.referralRepository
      .createQueryBuilder('ref')
      .where('ref.referrerUserId = :referrerUserId', {
        referrerUserId: userId,
      })
      .getCount();

    return { friends, totalFriends };
  }

  async getUserReferrer(userId: string) {
    const user = await this.referralRepository.findOne({
      where: { referredUserId: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user?.referrerUserId;
  }
}
