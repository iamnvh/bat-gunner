import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBoostEntity } from './user-boost.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { BoostService } from 'src/boost/boost.service';
import { BoostLevelType, ClaimType } from 'src/utils/constants';
import { UserService } from 'src/user/user.service';
import { ClaimService } from 'src/claim/claim.service';

@Injectable()
export class UserBoostService {
  constructor(
    @InjectRepository(UserBoostEntity)
    private readonly userBoostRepository: Repository<UserBoostEntity>,
    private readonly boostService: BoostService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => ClaimService))
    private readonly claimService: ClaimService,
  ) {}

  findOne(fields: FindOneOptions<UserBoostEntity>) {
    return this.userBoostRepository.findOne(fields);
  }

  async initBoost(userId: string) {
    const boostInit = await this.boostService.findOne({
      level: BoostLevelType.LEVEL_ZERO,
    });

    if (!boostInit) {
      throw new BadRequestException(`not_found_level_for_boost`);
    }

    return this.userBoostRepository.save({
      userId: userId,
      boostId: boostInit.id,
    });
  }

  async getBoostById(userId: string) {
    return this.userBoostRepository
      .createQueryBuilder('user_boost')
      .leftJoin('boost', 'boost', 'boost.id = user_boost.boostId')
      .where('user_boost.userId = :userId', { userId })
      .select([
        'boost.id as id',
        'boost.title as title',
        'boost.cost as cost',
        'boost.rate as rate',
        'boost.level as level',
      ])
      .getRawOne();
  }

  async updateBoost(args: { userId: string; boostId: string }) {
    const [user, boost, newBoostUpgrade] = await Promise.all([
      this.userService.getProfile({
        userId: args.userId,
      }),
      this.getBoostById(args.userId),
      this.boostService.findOne({
        id: args.boostId,
      }),
    ]);

    if (!user || !boost || !newBoostUpgrade) {
      throw new UnauthorizedException();
    }

    const checkLevel = newBoostUpgrade.level - boost.level;
    const checkPoint = newBoostUpgrade.cost < user.totalPoints;

    if (checkLevel != 1 || !checkPoint) {
      throw new BadRequestException(
        `Invalid_level_or_not_enough_points_to_upgrade`,
      );
    }

    await Promise.all([
      this.userBoostRepository
        .createQueryBuilder('user_boost')
        .update(UserBoostEntity)
        .set({ boostId: newBoostUpgrade.id })
        .where('user_boost."userId" = :userId', { userId: args.userId })
        .execute(),
      this.claimService.create({
        typeClaim: ClaimType.CLAIM_FOR_BOOST,
        userId: args.userId,
        point: -newBoostUpgrade.cost,
      }),
    ]);
  }
}
