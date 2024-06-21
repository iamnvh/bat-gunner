import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { ReferralService } from 'src/referral/referral.service';
import { ReferralDto } from 'src/referral/dto/referral.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly referralService: ReferralService,
  ) {}

  async register(dto: RegisterDto): Promise<any> {
    const [user, userReferrer] = await Promise.all([
      this.userService.findOne({ telegramId: dto.telegramId }),
      this.userService.findOne({
        telegramId: dto.referenceTelegramId,
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

    await this.referralService.create({
      referrerUserId: userReferrer.id,
      referredUserId: newUser.id,
    } as ReferralDto);
  }

  async login(telegramId: string) {
    const user = await this.userService.findOne({ telegramId: telegramId });
    if (!user) {
      throw new NotFoundException(`user_not_found`);
    }
  }
}
