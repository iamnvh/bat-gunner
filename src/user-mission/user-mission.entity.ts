import { MissionEntity } from 'src/mission/mission.entity';
import { UserEntity } from 'src/user/user.entity';
import { MissionStatusType } from 'src/utils/constants';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'user_mission' })
@Unique('user_mission_unique', ['userId', 'missionId'])
export class UserMissionEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'string' })
  userId: string;

  @ManyToOne(() => MissionEntity)
  @JoinColumn({ name: 'missionId' })
  mission: MissionEntity;

  @Column({ type: 'string' })
  missionId: string;

  @Column({
    nullable: true,
    type: 'boolean',
    default: MissionStatusType.NOT_STARTED,
  })
  status: MissionStatusType;
}
