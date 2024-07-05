import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GunEntity } from './gun.entity';
import { Repository } from 'typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { UserGunService } from 'src/user-gun/user-gun.service';
import { UserGunEntity } from 'src/user-gun/user-gun.entity';
import { UserService } from 'src/user/user.service';
import { GunStatusType } from 'src/utils/constants';

@Injectable()
export class GunService {
  constructor(
    @InjectRepository(GunEntity)
    private readonly gunRepository: Repository<GunEntity>,
    private readonly userGunService: UserGunService,
    private readonly userService: UserService,
  ) {}

  findOne(fields: EntityCondition<GunEntity>) {
    return this.gunRepository.findOne({
      where: fields,
    });
  }

  find() {
    return this.gunRepository.find();
  }

  async buyGunById(params: {
    userId: string;
    gunId: string;
    status?: GunStatusType;
  }) {
    const [user, gun] = await Promise.all([
      this.userService.findOne({
        id: params.userId,
      }),
      this.userGunService.findOne({
        where: {
          userId: params.userId,
          gunId: params.gunId,
        },
      }),
    ]);

    if (gun || !user) {
      throw new BadRequestException(`gun_already_exist_or_not_found_user`);
    }

    await this.userGunService.create({
      userId: params.userId,
      gunId: params.gunId,
      status: params?.status,
    } as UserGunEntity);

    return;
  }
}
