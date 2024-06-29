import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { CLAIM_TYPE } from 'src/utils/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  findOne(fields: EntityCondition<UserEntity>) {
    return this.userRepository.findOne({
      where: fields,
    });
  }

  create(user: RegisterDto): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  getProfile(params: { telegramId: string }) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoin('claim', 'claim', 'claim.userId = user.id')
      .where('user.telegramId = :telegramId', {
        telegramId: params.telegramId,
      })
      .select([
        'user.telegramId as "telegramId"',
        'user.telegramUsername as "telegramUsername"',
        'user.referrerTelegramId as "referrerTelegramId"',
        'user.lastName as "lastName"',
        'user.firstName as "firstName"',
        'user.tickets as tickets',
        'SUM(claim.point) as "totalPoints"',
        `(SELECT MAX(c."updatedAt") 
          FROM claim c 
          WHERE c."userId" = user.id AND c."typeClaim" = :typeClaim) as "lastClaimed"`,
      ])
      .setParameter('typeClaim', CLAIM_TYPE.CLAIM_FOR_ME)
      .groupBy('user.id')
      .getRawOne();
  }

  async findUser(telegramId?: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.telegramId = :telegramId', { telegramId })
      .getOne();
  }

  async handleMinusTicket(params: { userId: string; tickets: number }) {
    return this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        tickets: params.tickets,
      })
      .where('id = :userId', { userId: params.userId })
      .execute();
  }
}
