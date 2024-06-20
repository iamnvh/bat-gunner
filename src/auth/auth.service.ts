import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async validate(dto: AuthDto) {
    const user = await this.userService.findOne({ telegramId: dto.telegramId });
    if (!user) {
      throw new HttpException('User is created', 400);
    }
  }
}
