import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  Req,
  Res,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseAPI } from '../utils/func-helper';
import { IAuthorizedRequest } from '../utils/types/authorized-request.interface';
import { Response } from 'express';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';

@ApiTags('User')
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async profile(@Req() auth: IAuthorizedRequest, @Res() response: Response) {
    try {
      const data = await this.userService.getProfile({
        telegramId: auth.user.telegramId,
        telegramUsername: auth.user.telegramUsername,
      });
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ data: error, response });
    }
  }

  @Post('claim')
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async claim(@Req() auth: IAuthorizedRequest, @Res() response: Response) {
    try {
      const data = await this.userService.claim(auth.user.id);
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ data: error, response });
    }
  }
}
