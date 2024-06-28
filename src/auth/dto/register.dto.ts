import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  telegramId: string;

  @ApiProperty()
  @IsString()
  telegramUsername: string;

  @ApiProperty()
  @IsString()
  referrerTelegramId: string;
}
