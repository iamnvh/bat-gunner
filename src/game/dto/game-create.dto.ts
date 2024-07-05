import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';
import { GunType } from 'src/utils/constants';

export class GameCreateDto {
  @ApiProperty({
    nullable: false,
    enum: GunType,
    type: 'enum',
  })
  @IsNumber()
  @Type(() => Number)
  @IsEnum(GunType)
  gunType: GunType;

  @ApiProperty({ nullable: false })
  @IsNumber()
  @Type(() => Number)
  reward: number;
}
