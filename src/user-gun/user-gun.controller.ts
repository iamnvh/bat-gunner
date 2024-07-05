import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserGunService } from './user-gun.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';
import { IAuthorizedRequest } from 'src/utils/types/authorized-request.interface';
import { Response } from 'express';
import { ResponseAPI } from 'src/utils/func-helper';

@ApiTags('User Gun')
@Controller({ path: 'user-gun', version: '1' })
export class UserGunController {
  constructor(private readonly userGunService: UserGunService) {}

  @Get('market')
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async market(@Req() auth: IAuthorizedRequest, @Res() response: Response) {
    try {
      const data = await this.userGunService.findMarket(auth.user.id);
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }

  @Get('set')
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async setGunByUser(
    @Req() auth: IAuthorizedRequest,
    @Query('gunId') gunId: string,
    @Res() response: Response,
  ) {
    try {
      const data = await this.userGunService.setGunByUserId({
        userId: auth.user.id,
        gunId: gunId,
      });
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }

  @Get('gun')
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getGun(@Req() auth: IAuthorizedRequest, @Res() response: Response) {
    try {
      const data = await this.userGunService.getGun(auth.user.id);
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }
}
