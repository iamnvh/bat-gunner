import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionEntity } from './mission.entity';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { UserMissionModule } from 'src/user-mission/user-mission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MissionEntity]),
    forwardRef(() => UserMissionModule),
  ],
  controllers: [MissionController],
  providers: [MissionService],
  exports: [MissionService],
})
export class MissionModule {}
