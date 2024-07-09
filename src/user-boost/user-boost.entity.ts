import { BoostEntity } from 'src/boost/boost.entity';
import { UserEntity } from 'src/user/user.entity';
import { BoostStatusType } from 'src/utils/constants';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user_boost' })
@Unique('user_boost_unique', ['userId', 'boostId'])
export class UserBoostEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'string' })
  userId: string;

  @ManyToOne(() => BoostEntity)
  @JoinColumn({ name: 'boostId' })
  boost: BoostEntity;

  @Column({ type: 'string' })
  boostId: string;

  @Column({
    nullable: true,
    type: 'boolean',
    default: BoostStatusType.DISABLE,
  })
  @Index()
  status: BoostStatusType;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
  })
  updatedAt: Date;
}
