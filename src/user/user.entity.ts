import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string;

  @Column({ nullable: false })
  telegramId: number;

  @Column({ nullable: false })
  telegramUsername: string;

  @Column({ nullable: true })
  @CreateDateColumn({ type: 'timestamp' })
  timeEnd: Date;

  @Column({ nullable: true })
  @CreateDateColumn({ type: 'timestamp' })
  timeStart: Date;

  @Column({ nullable: false, default: 0 })
  point: number;

  @Column({ nullable: false, default: false })
  statusClaim: boolean;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
  })
  updatedAt: Date;
}
