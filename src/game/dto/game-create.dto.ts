import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';
import { GUN_TYPE } from 'src/utils/constants';

export class GameCreateDto {
  @ApiProperty({
    nullable: false,
    enum: GUN_TYPE,
    type: 'enum',
  })
  @IsNumber()
  @Type(() => Number)
  @IsEnum(GUN_TYPE)
  gunType: GUN_TYPE;

  @ApiProperty({ nullable: false })
  @IsNumber()
  @Type(() => Number)
  reward: number;
}
