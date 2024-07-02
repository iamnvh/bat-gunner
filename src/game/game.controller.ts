import {
  // Body,
  Controller,
  // HttpCode,
  // HttpStatus,
  // Post,
  // Req,
  // Res,
  // UseGuards,
} from '@nestjs/common';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { LocalAuthGuard } from 'src/auth/guards/local.guard';
// import { IAuthorizedRequest } from 'src/utils/types/authorized-request.interface';
// import { ResponseAPI } from 'src/utils/func-helper';
// import { Response } from 'express';
import { GameService } from './game.service';
// import { GameCreateDto } from './dto/game-create.dto';

// @ApiTags('Game')
@Controller({
  path: 'game',
  version: '1',
})
export class GameController {
  constructor(private readonly gameService: GameService) {}

  // @Post('claim')
  // @ApiBearerAuth()
  // @UseGuards(LocalAuthGuard)
  // @HttpCode(HttpStatus.OK)
  // async claimMission(
  //   @Req() auth: IAuthorizedRequest,
  //   @Body() gameDto: GameCreateDto,
  //   @Res() response: Response,
  // ) {
  //   try {
  //     const data = await this.gameService.update({
  //       userId: auth.user.id,
  //       reward: gameDto.reward,
  //     });
  //     ResponseAPI.Success({ data, response });
  //   } catch (error) {
  //     ResponseAPI.Fail({ message: error.message, response });
  //   }
  // }
}
