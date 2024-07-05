import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserMissionService } from './user-mission.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';
import { IAuthorizedRequest } from 'src/utils/types/authorized-request.interface';
import { PageDto } from 'src/utils/dto/page.dto';
import { ResponseAPI } from 'src/utils/func-helper';
import { Response } from 'express';
import { ClaimUserMissionDto } from './dto/user-mission-claim.dto';

@ApiTags('User-Mission')
@Controller({
  version: '1',
  path: 'user-mission',
})
export class UserMissionController {
  constructor(private readonly userMissionService: UserMissionService) {}

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMission(
    @Req() auth: IAuthorizedRequest,
    @Query() { offset, limit }: PageDto,
    @Res() response: Response,
  ) {
    try {
      const data = await this.userMissionService.getMissionByUserId({
        userId: auth.user.id,
        offset,
        limit,
      });
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }

  @Post('claim')
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async claimUserMission(
    @Req() auth: IAuthorizedRequest,
    @Body() { missionId }: ClaimUserMissionDto,
    @Res() response: Response,
  ) {
    try {
      const data = await this.userMissionService.claimMissionByUserId({
        userId: auth.user.id,
        missionId: missionId,
      });
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }
}
