import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserGunCreateDto {
  @ApiProperty({ nullable: false })
  @IsString()
  gunId: string;

  @ApiProperty({ nullable: false })
  @IsString()
  hash: string;
}
