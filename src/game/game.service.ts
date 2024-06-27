import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { GameEntity } from './game.entity';
import { GameDto } from './dto/game.dto';
import { UserService } from 'src/user/user.service';
import { ClaimService } from 'src/claim/claim.service';
import { CLAIM_TYPE } from 'src/utils/constants';
import { GunService } from 'src/gun/gun.service';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    private readonly userService: UserService,
    private readonly claimService: ClaimService,
    private readonly gunService: GunService,
  ) {}

  findOne(fields: EntityCondition<GameEntity>) {
    return this.gameRepository.findOne({
      where: fields,
    });
  }

  async update(params: GameDto) {
    const user = await this.userService.findOne({
      id: params.userId,
    });

    if (!user) {
      throw new UnauthorizedException(`user_not_found`);
    }

    if (user?.tickets < 1) {
      throw new BadRequestException(`not_found_ticket_or_not_enough_ticket`);
    }

    const gunOfUser = await this.gunService.findOne({
      userId: params.userId,
    });

    if (!gunOfUser) {
      throw new UnauthorizedException(`not_found_gun`);
    }

    const response = await this.gameRepository.save({
      userId: user.id,
      gunType: gunOfUser.gunType,
      reward: params.reward,
    });

    if (response) {
      await this.userService.handleMinusTicket({
        userId: user?.id,
        tickets: user?.tickets - 1,
      });

      await this.claimService.create({
        userId: user.id,
        typeClaim: CLAIM_TYPE.CLAIM_FOR_GAME,
        point: gunOfUser.gunType * response.reward,
      });
    }
  }
}
