import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { BoostService } from './boost.service';
import { ResponseAPI } from 'src/utils/func-helper';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Boost')
@Controller({
  path: 'boost',
  version: '1',
})
export class BoostController {
  constructor(private readonly boostService: BoostService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Res() response: Response) {
    try {
      const data = await this.boostService.find();
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }
}
