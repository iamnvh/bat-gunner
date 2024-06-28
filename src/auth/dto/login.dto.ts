import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @Type(() => String)
  telegramId: string;

  @ApiProperty()
  @IsString()
  @Type(() => String)
  telegramUsername: string;
}
