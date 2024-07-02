import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GunEntity } from 'src/gun/gun.entity';
import { GunSeedService } from './gun-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([GunEntity])],
  providers: [GunSeedService],
  exports: [GunSeedService],
})
export class GunSeedModule {}
