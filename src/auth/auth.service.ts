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
import { UserMissionService } from 'src/user-mission/user-mission.service';
import { UserGunService } from 'src/user-gun/user-gun.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly referralService: ReferralService,
    private readonly jwtService: JwtService,
    private readonly userMissionService: UserMissionService,
    private readonly userGunService: UserGunService,
  ) {}

  async register(dto: RegisterDto): Promise<any> {
    const [user, userReferrer] = await Promise.all([
      this.userService.findUser(dto?.telegramId),
      this.userService.findUserByTelegramId(dto?.referrerTelegramId),
    ]);

    if (user) {
      throw new NotFoundException(`user_already_exists`);
    }

    const newUser = await this.userService.create(dto);

    const promiseArr: any = [
      this.userMissionService.syncMission(newUser.id),
      this.userGunService.initGun(newUser.id),
    ];

    if (userReferrer) {
      promiseArr.push(
        this.referralService.create({
          referrerUserId: userReferrer?.id,
          referredUserId: newUser.id,
        } as ReferralDto),
      );
    }

    await Promise.all(promiseArr);

    return newUser;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findUserByTelegramId(
      loginDto?.telegramId,
    );

    if (!user) {
      throw new UnauthorizedException(`user_not_found`);
    }

    const token = this.jwtService.sign({
      telegramId: user.telegramId,
      firstName: user.firstName,
    });

    return { token };
  }

  async validateUser(telegramId: string) {
    const user = await this.userService.findOne({ telegramId });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
