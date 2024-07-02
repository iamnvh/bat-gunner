import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  findAll() {
    return this.gunRepository
      .createQueryBuilder('gun')
      .select([
        'gun.id as id',
        'gun.title as title',
        'gun.price as price',
        'gun.type as type',
      ])
      .getRawMany();
  }
}
