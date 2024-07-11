import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  Req,
  Res,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseAPI } from '../utils/func-helper';
import { IAuthorizedRequest } from '../utils/types/authorized-request.interface';
import { Response } from 'express';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';
import { UserUpdateDto } from './dto/user-update.dto';

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
        userId: auth.user.id,
      });
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }

  @Post('daily')
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async checkIn(@Req() auth: IAuthorizedRequest, @Res() response: Response) {
    try {
      const data = await this.userService.checkInDaily(auth.user.id);
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }

  @Post('update')
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateUserInfo(
    @Req() auth: IAuthorizedRequest,
    @Body() dtoUpdateUser: UserUpdateDto,
    @Res() response: Response,
  ) {
    try {
      const data = await this.userService.update({
        userId: auth.user.id,
        walletAddress: dtoUpdateUser.walletAddress,
      });
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }
}
