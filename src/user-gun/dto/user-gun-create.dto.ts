import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UserGunCreateDto {
  @ApiProperty({ nullable: false })
  @IsString()
  gunId: string;

  @ApiProperty({ nullable: false })
  @IsString()
  hash: string;

  @ApiProperty({ nullable: false })
  @IsNumber()
  lt: number;
}
