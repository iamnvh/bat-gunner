import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { RegisterDto } from 'src/auth/dto/register.dto';

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

  getProfile(params: { telegramId: string; telegramUsername: string }) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoin('claim', 'claim', 'claim.userId = user.id')
      .where('user.telegramId = :telegramId', { telegramId: params.telegramId })
      .andWhere('user.telegramUsername = :telegramUsername', {
        telegramUsername: params.telegramUsername,
      })
      .select([
        'user.telegramId as "telegramId"',
        'user.telegramUsername as "telegramUsername"',
        'user.tickets as tickets',
        'SUM(claim.point) as "totalPoints"',
        'MAX(claim.updatedAt) as "lastClaimed"',
      ])
      .groupBy('user.id')
      .getRawOne();
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
