import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GameDto {
  @ApiProperty({ type: 'float', nullable: false })
  @IsNumber()
  reward: number;
}
