import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGunEntity } from './user-gun.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { GunEntity } from 'src/gun/gun.entity';
import { UserService } from 'src/user/user.service';
import { GunStatusType } from 'src/utils/constants';
import { GunService } from 'src/gun/gun.service';

@Injectable()
export class UserGunService {
  constructor(
    @InjectRepository(UserGunEntity)
    private readonly userGunRepository: Repository<UserGunEntity>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => GunService))
    private readonly gunService: GunService,
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

  async findMarket(userId: string) {
    const user = await this.userService.findOne({
      id: userId,
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    const [gunsIsOwner, gunsMarket] = await Promise.all([
      this.userGunRepository.find({
        where: {
          userId: userId,
        },
      }),
      this.gunService.find(),
    ]);

    const gunsWithOwnership = gunsMarket.map((gun) => {
      const isOwned = gunsIsOwner.some((ownerGun) => ownerGun.gunId === gun.id);
      return {
        ...gun,
        isOwner: isOwned,
      };
    });

    return gunsWithOwnership;
  }

  async getGun(userId: string) {
    const gun = await this.userGunRepository
      .createQueryBuilder('user_gun')
      .leftJoin('gun', 'gun', 'gun.id = user_gun."gunId"')
      .where('user_gun."userId" = :userId', { userId })
      .andWhere('status = :status', { status: GunStatusType.ENABLE })
      .select([
        'gun.id as id',
        'gun.title as title',
        'gun.image as images',
        'gun.type as type',
        'gun.level as level',
        'gun.price as price',
      ])
      .getRawOne();

    if (!gun) {
      throw new BadRequestException(`gun_not_found`);
    }
    return gun;
  }

  async disableGuns(userId: string) {
    return this.userGunRepository
      .createQueryBuilder('user_gun')
      .update(UserGunEntity)
      .set({ status: GunStatusType.DISABLE })
      .where('user_gun."userId" = :userId', { userId })
      .execute();
  }

  async setGunByUserId(params: { userId: string; gunId: string }) {
    const user = await this.userService.findOne({
      id: params.userId,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isExistGun = await this.findOne({
      where: {
        userId: params.userId,
        gunId: params.gunId,
      },
    });

    if (!isExistGun) {
      throw new NotFoundException(`this_gun_has_not_been_purchased_yet`);
    }

    await this.disableGuns(params.userId);
    await this.userGunRepository
      .createQueryBuilder('user_gun')
      .update(UserGunEntity)
      .set({ status: GunStatusType.ENABLE })
      .where('user_gun."userId" = :userId', { userId: params.userId })
      .andWhere('user_gun."gunId" = :gunId', { gunId: params.gunId })
      .execute();
  }
}
