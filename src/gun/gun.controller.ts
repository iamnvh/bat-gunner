import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GunService } from './gun.service';
import { ResponseAPI } from 'src/utils/func-helper';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IAuthorizedRequest } from 'src/utils/types/authorized-request.interface';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';

@ApiTags('Gun')
@Controller({ path: 'gun', version: '1' })
export class GunController {
  constructor(private readonly gunService: GunService) {}

  @Post('buy')
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async buyGun(
    @Req() auth: IAuthorizedRequest,
    @Query('gunId') gunId: string,
    @Res() response: Response,
  ) {
    try {
      const data = await this.gunService.buyGunById({
        userId: auth.user.id,
        gunId: gunId,
      });
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }
}
