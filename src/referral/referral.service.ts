import { Injectable } from '@nestjs/common';
// import { ReferralDto } from './dto/referral.dto';
import { ReferralEntity } from './referral.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(ReferralEntity)
    private referralRepository: Repository<ReferralEntity>,
  ) {}

  create(referral: ReferralEntity): Promise<ReferralEntity> {
    return this.referralRepository.save(referral);
  }

  async checkLimitReferral(userId: string): Promise<boolean> {
    const count = await this.referralRepository.count({
      where: { referrerUserId: userId },
    });

    return count < 5;
  }
}
