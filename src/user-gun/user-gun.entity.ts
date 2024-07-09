import { GunEntity } from 'src/gun/gun.entity';
import { UserEntity } from 'src/user/user.entity';
import { GunStatusType } from 'src/utils/constants';
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

@Entity({ name: 'user_gun' })
@Unique('user_gun_unique', ['userId', 'gunId'])
export class UserGunEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'string' })
  userId: string;

  @ManyToOne(() => GunEntity)
  @JoinColumn({ name: 'gunId' })
  gun: GunEntity;

  @Column({ type: 'string' })
  gunId: string;

  @Column({
    nullable: true,
    type: 'boolean',
    default: GunStatusType.DISABLE,
  })
  @Index()
  status: GunStatusType;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
  })
  updatedAt: Date;
}
