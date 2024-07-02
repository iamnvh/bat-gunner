import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGunEntity } from './user-gun.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { GunEntity } from 'src/gun/gun.entity';

@Injectable()
export class UserGunService {
  constructor(
    @InjectRepository(UserGunEntity)
    private readonly userGunRepository: Repository<UserGunEntity>,
  ) {}

  findOne(fields: FindOneOptions<UserGunEntity>) {
    return this.userGunRepository.findOne(fields);
  }

  async create(item: UserGunEntity) {
    const res = await this.userGunRepository.findOne({
      where: { userId: item.userId, gunId: item.gunId },
    });
    if (!!res?.id) {
      return res;
    }
    return this.userGunRepository.insert(item);
  }

  save(userId: string, item: GunEntity) {
    return this.userGunRepository.update({ user: { id: userId } }, item);
  }
}
