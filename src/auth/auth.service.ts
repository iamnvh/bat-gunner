import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { ReferralService } from 'src/referral/referral.service';
import { ReferralDto } from 'src/referral/dto/referral.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MissionService } from 'src/mission/mission.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly referralService: ReferralService,
    private readonly jwtService: JwtService,
    private readonly missionService: MissionService,
  ) {}

  async register(dto: RegisterDto): Promise<any> {
    const [user, userReferrer] = await Promise.all([
      this.userService.findUser(dto),
      this.userService.findOne({
        telegramId: dto.referrerTelegramId,
      }),
    ]);

    if (!userReferrer) {
      throw new NotFoundException(`user_referral_not_found`);
    }
    const countLimit = await this.referralService.checkLimitReferral(
      userReferrer.id,
    );

    if (!countLimit) {
      throw new NotFoundException(`user_limited_referral`);
    }

    if (user) {
      throw new NotFoundException(`user_already_exists`);
    }

    const newUser = await this.userService.create(dto);

    await Promise.all([
      this.referralService.create({
        referrerUserId: userReferrer.id,
        referredUserId: newUser.id,
      } as ReferralDto),
      this.missionService.syncMission(newUser.id),
    ]);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOne({
      telegramId: loginDto.telegramId,
      telegramUsername: loginDto.telegramUsername,
    });

    if (!user) {
      throw new UnauthorizedException(`user_not_found`);
    }

    const token = this.jwtService.sign({
      telegramId: loginDto.telegramId,
      telegramUsername: loginDto.telegramUsername,
    });

    return { token };
  }

  async validateUser(telegramId: string, telegramUsername: string) {
    const user = await this.userService.findOne({
      telegramId: telegramId,
      telegramUsername: telegramUsername,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
