import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ClaimUserMissionDto {
  @ApiProperty()
  @IsUUID()
  missionId: string;
}
