import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserEntity } from 'src/user/user.entity';

export class RegisterDto extends UserEntity {
  @ApiProperty()
  @IsString()
  telegramId: string;

  @ApiProperty()
  @IsString()
  telegramUsername: string;

  @ApiProperty()
  @IsString()
  referenceTelegramId: string;
}
