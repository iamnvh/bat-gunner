import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UserBoostDto {
  @ApiProperty()
  @IsUUID()
  boostId: string;
}
