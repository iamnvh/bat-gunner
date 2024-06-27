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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';
import { IAuthorizedRequest } from 'src/utils/types/authorized-request.interface';
import { ResponseAPI } from 'src/utils/func-helper';
import { Response } from 'express';
import { MissionService } from './mission.service';
import { MissionDto } from './dto/mission.dto';

@ApiTags('Mission')
@Controller({
  path: 'mission',
  version: '1',
})
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get('')
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMission(@Req() auth: IAuthorizedRequest, @Res() response: Response) {
    try {
      const data = await this.missionService.getMissionsByUserId(auth.user.id);
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }

  @Post('claim')
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async claimMission(
    @Req() auth: IAuthorizedRequest,
    @Body() missionDto: MissionDto,
    @Res() response: Response,
  ) {
    try {
      const data = await this.missionService.update({
        missionId: missionDto.missionId,
        userId: auth.user.id,
      });
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }
}
