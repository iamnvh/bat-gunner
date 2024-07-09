import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GameDto {
  @ApiProperty({ nullable: false })
  @IsNumber()
  reward: number;
}
