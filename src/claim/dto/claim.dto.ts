import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { CLAIM_TYPE } from 'src/utils/constants';

export class ClaimDto {
  @ApiProperty({
    nullable: false,
    enum: CLAIM_TYPE,
    type: 'enum',
  })
  @IsString()
  @IsEnum(CLAIM_TYPE)
  typeClaim: CLAIM_TYPE;

  @ApiProperty({ nullable: false })
  @IsString()
  userId: string;

  @ApiProperty({ type: 'float', nullable: false })
  @IsNumber()
  point: number;
}
