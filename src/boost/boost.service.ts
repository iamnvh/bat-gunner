import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoostEntity } from './boost.entity';
import { Repository } from 'typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';

@Injectable()
export class BoostService {
  constructor(
    @InjectRepository(BoostEntity)
    private readonly boostRepository: Repository<BoostEntity>,
  ) {}

  findOne(fields: EntityCondition<BoostEntity>) {
    return this.boostRepository.findOne({
      where: fields,
    });
  }

  find() {
    return this.boostRepository.find();
  }
}
