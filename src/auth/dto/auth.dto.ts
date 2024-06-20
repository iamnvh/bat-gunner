import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsNumber()
  telegramId: number;

  @ApiProperty()
  @IsString()
  telegramUsername: string;
}
