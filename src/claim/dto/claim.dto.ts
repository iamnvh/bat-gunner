import { ApiProperty } from '@nestjs/swagger';
import { CLAIM_TYPE } from 'src/utils/constants';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class ClaimDto {
  @ApiProperty({
    type: 'enum',
    enum: CLAIM_TYPE,
    example: CLAIM_TYPE.CLAIM_FOR_ME,
  })
  @IsEnum(CLAIM_TYPE)
  @Type(() => String)
  typeClaim: CLAIM_TYPE;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  point: number;
}
