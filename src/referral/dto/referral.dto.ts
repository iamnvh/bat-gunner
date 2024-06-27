import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ReferralEntity } from '../referral.entity';

export class ReferralDto extends ReferralEntity {
  @ApiProperty()
  @IsString()
  referrerUserId: string;

  @ApiProperty()
  @IsString()
  referredUserId: string;
}
