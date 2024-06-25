import {
  Controller,
  HttpStatus,
  HttpCode,
  Req,
  Res,
  UseGuards,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseAPI } from '../utils/func-helper';
import { IAuthorizedRequest } from '../utils/types/authorized-request.interface';
import { Response } from 'express';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';
import { ClaimService } from './claim.service';

@ApiTags('Claim')
@Controller({
  path: 'claim',
  version: '1',
})
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async claim(@Req() auth: IAuthorizedRequest, @Res() response: Response) {
    try {
      const data = await this.claimService.claim(auth.user.id);
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }
}
