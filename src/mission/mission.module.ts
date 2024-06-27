import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionEntity } from './mission.entity';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { ClaimModule } from 'src/claim/claim.module';

@Module({
  imports: [TypeOrmModule.forFeature([MissionEntity]), ClaimModule],
  controllers: [MissionController],
  providers: [MissionService],
  exports: [MissionService],
})
export class MissionModule {}
