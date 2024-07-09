import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMissionEntity } from './user-mission.entity';
import { UserMissionService } from './user-mission.service';
import { UserMissionController } from './user-mission.controller';
import { ClaimModule } from 'src/claim/claim.module';
import { MissionModule } from 'src/mission/mission.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserMissionEntity]),
    ClaimModule,
    UserModule,
    forwardRef(() => MissionModule),
  ],
  controllers: [UserMissionController],
  providers: [UserMissionService],
  exports: [UserMissionService],
})
export class UserMissionModule {}
