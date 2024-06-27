import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GUN_TYPE } from 'src/utils/constants';
import { GunEntity } from './gun.entity';
import { Repository } from 'typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';

@Injectable()
export class GunService {
  constructor(
    @InjectRepository(GunEntity)
    private readonly gunRepository: Repository<GunEntity>,
  ) {}

  findOne(fields: EntityCondition<GunEntity>) {
    return this.gunRepository.findOne({
      where: fields,
    });
  }

  async initGun(userId: string) {
    return this.gunRepository.save({
      userId: userId,
      title: 'GUN BLACK',
      gunType: 1,
      price: 0,
    });
  }

  async update(params: { userId: string; typeGun: GUN_TYPE }) {
    return this.gunRepository
      .createQueryBuilder()
      .update(GunEntity)
      .update({
        gunType: params.typeGun,
      })
      .where('id = :userId', { userId: params.userId })
      .execute();
  }
}
