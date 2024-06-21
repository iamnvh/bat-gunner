import { UserEntity } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity({ name: 'referral' })
export class ReferralEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  referrerUserId: string;

  @Column({ nullable: true })
  referredUserId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'referrerUserId' })
  userReferrer: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'referredUserId' })
  userReferred: UserEntity;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
  })
  updatedAt: Date;
}
