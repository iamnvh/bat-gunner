import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameEntity } from './game.entity';
import { UserService } from 'src/user/user.service';
import { ClaimService } from 'src/claim/claim.service';
import { GameDto } from './dto/game.dto';
import { UserGunService } from 'src/user-gun/user-gun.service';
import { ClaimType } from 'src/utils/constants';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    private readonly userService: UserService,
    private readonly claimService: ClaimService,
    private readonly userGunService: UserGunService,
  ) {}

  async claim(params: GameDto & { userId: string }) {
    const [user, gunOfUser] = await Promise.all([
      this.userService.getProfile({ userId: params.userId }),
      this.userGunService.getGun(params.userId),
    ]);

    if (!user && user?.tickets < 1) {
      throw new BadRequestException(`user_not_found_or_not_enough_ticket`);
    }

    if (!gunOfUser) {
      throw new UnauthorizedException();
    }

    const response = await this.gameRepository.save({
      userId: params.userId,
      reward: params.reward,
      gunType: gunOfUser.type,
    });

    if (response) {
      await Promise.all([
        this.userService.handleTicket({
          userId: params.userId,
          tickets: -1,
        }),
        this.claimService.create({
          userId: params.userId,
          typeClaim: ClaimType.CLAIM_FOR_GAME,
          point: params.reward * gunOfUser.level,
        }),
      ]);
    }
  }
}
