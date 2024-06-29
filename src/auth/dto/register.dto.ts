import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  telegramId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  telegramUsername?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  referrerTelegramId?: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  languageCode?: string;
}
