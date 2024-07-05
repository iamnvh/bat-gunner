import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class MissionDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  reward: number;

  @ApiProperty()
  @IsString()
  link: string;
}
