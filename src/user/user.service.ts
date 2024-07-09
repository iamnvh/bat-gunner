import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { ClaimType } from 'src/utils/constants';
import { UserGunService } from 'src/user-gun/user-gun.service';
import { checkDate } from 'src/utils/func-helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => UserGunService))
    private readonly userGunService: UserGunService,
  ) {}

  findOne(fields: EntityCondition<UserEntity>) {
    return this.userRepository.findOne({
      where: fields,
    });
  }

  findUserByTelegramId(
    telegramId: string | undefined,
  ): Promise<UserEntity | undefined> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.telegramId = :telegramId', { telegramId })
      .select([
        'user.id as id',
        'user.telegramId as "telegramId"',
        'user.telegramUsername as "telegramUsername"',
        'user.referrerTelegramId as "referrerTelegramId"',
        'user.lastName as "lastName"',
        'user.firstName as "firstName"',
        'user.tickets as tickets',
      ])
      .getRawOne();
  }

  create(user: RegisterDto): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  getProfile(params: { userId: string }) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoin('claim', 'claim', 'claim.userId = user.id')
      .where('user.id = :userId', {
        userId: params.userId,
      })
      .select([
        'user.telegramId as "telegramId"',
        'user.telegramUsername as "telegramUsername"',
        'user.referrerTelegramId as "referrerTelegramId"',
        'user.lastName as "lastName"',
        'user.firstName as "firstName"',
        'user.tickets as tickets',
        'user.lastCheckIn as "lastCheckIn"',
        'SUM(claim.point) as "totalPoints"',
        `(SELECT MAX(c."updatedAt") 
          FROM claim c 
          WHERE c."userId" = user.id AND c."typeClaim" = :typeClaim) as "lastClaimed"`,
      ])
      .setParameter('typeClaim', ClaimType.CLAIM_FOR_ME)
      .groupBy('user.id')
      .getRawOne();
  }

  async findUser(telegramId?: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.telegramId = :telegramId', { telegramId })
      .getOne();
  }

  async handleTicket(params: { userId: string; tickets: number }) {
    const user = await this.getProfile({ userId: params.userId });

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        tickets: user.tickets + params.tickets,
      })
      .where('id = :userId', { userId: params.userId })
      .execute();
  }

  async checkInDaily(userId: string) {
    const [user, gun] = await Promise.all([
      this.getProfile({ userId }),
      this.userGunService.getGun(userId),
    ]);

    if (!user || !gun) {
      throw new UnauthorizedException();
    }

    const isSameDay = checkDate(user?.lastCheckIn, new Date());
    if (isSameDay) {
      throw new BadRequestException(`reward_has_been_received`);
    }

    await this.handleTicket({
      userId: userId,
      tickets: gun?.ticket,
    });
  }
}
