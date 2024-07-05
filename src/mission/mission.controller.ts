import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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

  @Get('admin/missions')
  @HttpCode(HttpStatus.OK)
  async findAllMission(@Res() response: Response) {
    try {
      const data = await this.missionService.find();
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }

  @Post('admin/update')
  @HttpCode(HttpStatus.OK)
  async updateMission(
    @Body() missionDto: MissionDto,
    @Res() response: Response,
  ) {
    try {
      const data = await this.missionService.update(missionDto);
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }
}
