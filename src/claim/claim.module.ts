import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaimEntity } from './claim.entity';
import { ClaimService } from './claim.service';
import { ClaimController } from './claim.controller';
import { UserModule } from 'src/user/user.module';
import { ReferralModule } from 'src/referral/referral.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClaimEntity]),
    UserModule,
    ReferralModule,
  ],
  controllers: [ClaimController],
  providers: [ClaimService],
  exports: [ClaimService],
})
export class ClaimModule {}
