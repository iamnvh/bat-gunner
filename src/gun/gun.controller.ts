import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { GunService } from './gun.service';
import { ResponseAPI } from 'src/utils/func-helper';
import { Response } from 'express';

@Controller('gun')
export class GunController {
  constructor(private readonly gunService: GunService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Res() response: Response) {
    try {
      const data = await this.gunService.findAll();
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }
}
