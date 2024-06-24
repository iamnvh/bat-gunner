import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { PointClaim, HOURS_SPEND_CLAIM } from 'src/utils/constants';
import { ReferralService } from 'src/referral/referral.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly referralService: ReferralService,
  ) {}

  findOne(fields: EntityCondition<UserEntity>) {
    return this.userRepository.findOne({
      where: fields,
    });
  }

  create(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  softDelete(id: string) {
    return this.userRepository.softDelete(id);
  }

  async updatePoint(userId: string, point: number) {
    await this.userRepository
      .createQueryBuilder('user')
      .update(UserEntity)
      .set({
        timeLastClaim: new Date(),
        totalPoints: point,
      })
      .where('id = :userId', { userId })
      .execute();

    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .select([
        'user.telegramUsername as displayName',
        'user.totalPoints as totalPoints',
        'user.timeLastClaim as timeLastClaim',
      ])
      .getRawOne();
  }

  async claim(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user?.timeLastClaim == null) {
      return this.updatePoint(userId, PointClaim.CLAIM_LEVEL_1);
    }

    const now = new Date();
    const lastClaimTime = new Date(user.timeLastClaim);

    const isClaimAvailable =
      now.getTime() - lastClaimTime.getTime() < HOURS_SPEND_CLAIM;

    if (isClaimAvailable) {
      throw new BadRequestException(`not_enough_time_to_claim`);
    }

    const userReferrer = await this.referralService.getUserReferrer(user.id);
    console.log(userReferrer);
  }
}
