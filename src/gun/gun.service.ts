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

  find() {
    return this.gunRepository.find();
  }
}
