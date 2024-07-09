import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoostEntity } from 'src/boost/boost.entity';
import { BoostSeedService } from './boost-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoostEntity])],
  providers: [BoostSeedService],
  exports: [BoostSeedService],
})
export class BoostSeedModule {}
