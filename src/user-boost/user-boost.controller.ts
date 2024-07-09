import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserBoostService } from './user-boost.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';
import { IAuthorizedRequest } from 'src/utils/types/authorized-request.interface';
import { UserBoostDto } from './dto/user-boost.dto';
import { Response } from 'express';
import { ResponseAPI } from 'src/utils/func-helper';

@ApiTags('User Boost')
@Controller({
  path: 'user-boost',
  version: '1',
})
export class UserBoostController {
  constructor(private readonly userBoostService: UserBoostService) {}

  @Get('boost')
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getBoost(@Req() auth: IAuthorizedRequest, @Res() response: Response) {
    try {
      const data = await this.userBoostService.getBoostById(auth.user.id);
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }

  @Post('update')
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async updateBoost(
    @Req() auth: IAuthorizedRequest,
    @Body() dtoBoost: UserBoostDto,
    @Res() response: Response,
  ) {
    try {
      const data = await this.userBoostService.updateBoost({
        userId: auth.user.id,
        boostId: dtoBoost.boostId,
      });
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }
}
