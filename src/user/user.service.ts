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

  softDelete(id: string) {
    return this.userRepository.softDelete(id);
  }
}
