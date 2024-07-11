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
import { GunStatusType, GunType } from 'src/utils/constants';
import { GunService } from 'src/gun/gun.service';
import { UserGunCreateDto } from './dto/user-gun-create.dto';
import { TonService } from 'src/ton/ton.service';

@Injectable()
export class UserGunService {
  constructor(
    @InjectRepository(UserGunEntity)
    private readonly userGunRepository: Repository<UserGunEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => GunService))
    private readonly gunService: GunService,
    private readonly tonService: TonService,
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

  async initGun(userId: string) {
    const gunFree = await this.gunService.findOne({
      type: GunType.FREE,
    });

    if (!gunFree) {
      throw new BadRequestException(`not_found_gun_free`);
    }

    return this.create({
      userId: userId,
      gunId: gunFree?.id,
      status: GunStatusType.ENABLE,
    } as UserGunEntity);
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

  async buyGunById(
    params: UserGunCreateDto & {
      userId: string;
    },
  ) {
    const [user, gun] = await Promise.all([
      this.userService.findOne({
        id: params.userId,
      }),
      this.findOne({
        where: {
          userId: params.userId,
          gunId: params.gunId,
        },
      }),
    ]);

    if (gun || !user) {
      throw new BadRequestException(`gun_already_exist_or_not_found_user`);
    }
    const [transaction, newGun] = await Promise.all([
      this.tonService.getTransaction({
        walletAddress: user.walletAddress,
        lt: params.lt,
        hash: params.hash,
      }),
      this.gunService.findOne({
        id: params.gunId,
      }),
    ]);

    if (!transaction || !newGun) {
      throw new BadRequestException(
        `not_found_transaction_or_not_found_new_gun`,
      );
    }

    const valueTransfer = transaction?.value / 1000000000;
    const messageTransfer = transaction?.message;
    const valueGunRequire = newGun?.price;

    if (messageTransfer != user.walletAddress) {
      throw new BadRequestException(`wallet_address_not_valid`);
    }
    if (!valueTransfer) {
      throw new BadRequestException(`not_found_value_of_transaction`);
    }

    if (valueTransfer < valueGunRequire) {
      throw new BadRequestException(`not_enough_money_for_transaction`);
    }

    await this.create({
      userId: params.userId,
      gunId: params.gunId,
      status: GunStatusType.ENABLE,
    } as UserGunEntity);

    return;
  }
}
