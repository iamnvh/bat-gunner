import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { ResponseAPI } from 'src/utils/func-helper';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto, @Res() response: Response) {
    try {
      const data = await this.authService.validate(dto);
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ data: error, response });
    }
  }
}
