import { UserEntity } from 'src/user/user.entity';
import { CLAIM_TYPE } from 'src/utils/constants';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity({ name: 'claim' })
export class ClaimEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  userClaim: UserEntity;

  @Column({ type: 'float', nullable: false })
  point: number;

  @Column({
    nullable: false,
    type: 'enum',
    enum: CLAIM_TYPE,
    default: CLAIM_TYPE.CLAIM_FOR_ME,
  })
  typeClaim: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
  })
  updatedAt: Date;
}
