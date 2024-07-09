import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaimEntity } from './claim.entity';
import { ClaimService } from './claim.service';
import { ClaimController } from './claim.controller';
import { UserModule } from 'src/user/user.module';
import { ReferralModule } from 'src/referral/referral.module';
import { UserBoostModule } from 'src/user-boost/user-boost.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClaimEntity]),
    UserModule,
    ReferralModule,
    forwardRef(() => UserBoostModule),
  ],
  controllers: [ClaimController],
  providers: [ClaimService],
  exports: [ClaimService],
})
export class ClaimModule {}
