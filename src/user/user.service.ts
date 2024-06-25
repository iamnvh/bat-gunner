import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { EntityCondition } from 'src/utils/types/entity-condition.type';

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
        'user.telegramId as "telegramId"',
        'user.telegramUsername as "telegramUsername"',
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
}
