import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class MissionDto {
  @ApiProperty({ example: 'cc73965e-3c11-40f3-93c5-3ec6412c26bd' })
  @IsUUID()
  missionId: string;
}
