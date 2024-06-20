import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseAPI } from '../utils/func-helper';
import { IAuthorizedRequest } from '../utils/types/authorized-request.interface';
import { Response } from 'express';

@ApiTags('User')
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  findOne(@Req() auth: IAuthorizedRequest, @Res() response: Response) {
    const data = 'Done';
    ResponseAPI.Success({ data, response });
  }
}
