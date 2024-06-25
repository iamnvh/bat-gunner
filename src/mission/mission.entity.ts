import { UserEntity } from 'src/user/user.entity';
import { MISSION_STATUS, MISSION_TYPE } from 'src/utils/constants';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity({ name: 'mission' })
export class MissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: MISSION_STATUS,
    default: MISSION_STATUS.NOT_STARTED,
  })
  status: MISSION_STATUS;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'float', nullable: false })
  reward: number;

  @Column({
    nullable: false,
    type: 'enum',
    enum: MISSION_TYPE,
  })
  type: MISSION_TYPE;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
  })
  updatedAt: Date;
}
