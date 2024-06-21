import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ResponseAPI } from 'src/utils/func-helper';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto, @Res() response: Response) {
    try {
      const data = await this.authService.register(dto);
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ data: error, response });
    }
  }

  @Get('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res() response: Response) {
    try {
      const data = await this.authService.login(dto.telegramId);
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ data: error, response });
    }
  }
}
