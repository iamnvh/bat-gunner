import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsNumber()
  telegramId: number;

  @ApiProperty()
  @IsString()
  telegramUsername: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  referenceUserId: string;
}
