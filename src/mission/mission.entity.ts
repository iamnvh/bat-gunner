import { MissionType } from 'src/utils/constants';
import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity({ name: 'mission' })
export class MissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'float', nullable: false, default: 0 })
  reward: number;

  @Column({ nullable: false, default: 0 })
  ticket: number;

  @Column({ nullable: false })
  link: string;

  @Column({ nullable: false, type: 'enum', enum: MissionType })
  type: MissionType;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
  })
  updatedAt: Date;
}
