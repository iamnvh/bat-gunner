import { Module, forwardRef } from '@nestjs/common';
import { UserBoostService } from './user-boost.service';
import { UserBoostController } from './user-boost.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBoostEntity } from './user-boost.entity';
import { BoostModule } from 'src/boost/boost.module';
import { UserModule } from 'src/user/user.module';
import { ClaimModule } from 'src/claim/claim.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserBoostEntity]),
    BoostModule,
    UserModule,
    forwardRef(() => ClaimModule),
  ],
  controllers: [UserBoostController],
  providers: [UserBoostService],
  exports: [UserBoostService],
})
export class UserBoostModule {}
