import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { ClaimType } from 'src/utils/constants';

export class ClaimDto {
  @ApiProperty({
    nullable: false,
    enum: ClaimType,
    type: 'enum',
  })
  @IsString()
  @IsEnum(ClaimType)
  typeClaim: ClaimType;

  @ApiProperty({ nullable: false })
  @IsString()
  userId: string;

  @ApiProperty({ type: 'float', nullable: false })
  @IsNumber()
  point: number;
}
