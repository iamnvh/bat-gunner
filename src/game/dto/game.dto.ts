import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GameDto {
  @ApiProperty({ nullable: false })
  @IsString()
  userId: string;

  @ApiProperty({ type: 'float', nullable: false })
  @IsNumber()
  reward: number;
}
