import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaimEntity } from './claim.entity';
import { ClaimService } from './claim.service';
@Module({
  imports: [TypeOrmModule.forFeature([ClaimEntity])],
  controllers: [],
  providers: [ClaimService],
  exports: [ClaimService],
})
export class ClaimModule {}
