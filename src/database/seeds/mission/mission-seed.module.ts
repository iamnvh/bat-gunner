import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionEntity } from 'src/mission/mission.entity';
import { MissionSeedService } from './mission-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([MissionEntity])],
  providers: [MissionSeedService],
  exports: [MissionSeedService],
})
export class MissionSeedModule {}
