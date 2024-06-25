import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ClaimService } from 'src/claim/claim.service';
import { ClaimModule } from 'src/claim/claim.module';
import { ClaimEntity } from 'src/claim/claim.entity';
import { ReferralModule } from 'src/referral/referral.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ClaimEntity]),
    JwtModule,
    ClaimModule,
    ReferralModule,
  ],
  controllers: [UserController],
  providers: [UserService, ClaimService],
  exports: [UserService],
})
export class UserModule {}
