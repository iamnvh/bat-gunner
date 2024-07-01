import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReferralService } from './referral.service';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';
import { IAuthorizedRequest } from 'src/utils/types/authorized-request.interface';
import { ResponseAPI } from 'src/utils/func-helper';
import { Response } from 'express';
import { PageDto } from 'src/utils/dto/page.dto';

@ApiTags('Referral')
@Controller({
  path: 'ref',
  version: '1',
})
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get('friends')
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async profile(
    @Req() auth: IAuthorizedRequest,
    @Query() { offset, limit }: PageDto,
    @Res() response: Response,
  ) {
    try {
      const data = await this.referralService.friends({
        userId: auth.user.id,
        offset,
        limit,
      });
      ResponseAPI.Success({ data, response });
    } catch (error) {
      ResponseAPI.Fail({ message: error.message, response });
    }
  }
}
