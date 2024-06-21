import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string;

  @Column({ nullable: false })
  telegramId: string;

  @Column({ nullable: false })
  telegramUsername: string;

  @Column({ type: 'timestamp', nullable: true })
  timeStartClaim: Date;

  @Column({ type: 'timestamp', nullable: true })
  timeLastClaim: Date;

  @Column({ nullable: true, default: 0 })
  totalPoints: number;

  @Column({ nullable: true, default: 0 })
  playPasses: number;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
  })
  updatedAt: Date;
}
