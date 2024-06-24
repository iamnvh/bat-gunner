import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ReferralService } from 'src/referral/referral.service';
import { ReferralEntity } from 'src/referral/referral.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ReferralEntity]), JwtModule],
  controllers: [UserController],
  providers: [UserService, ReferralService],
  exports: [UserService],
})
export class UserModule {}
