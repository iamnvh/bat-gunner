import { UserEntity } from 'src/user/user.entity';
import { GUN_TYPE } from 'src/utils/constants';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity({ name: 'game' })
export class GameEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
    enum: GUN_TYPE,
    default: GUN_TYPE.FREE,
  })
  gunType: GUN_TYPE;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
  })
  updatedAt: Date;
}
