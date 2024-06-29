import { IsOptional } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  Index,
  Unique,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
@Unique('user_unique', ['telegramId'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string;

  @Column({ nullable: false })
  telegramId: string;

  @Column({ nullable: true })
  telegramUsername?: string;

  @Column({ nullable: true })
  referrerTelegramId?: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: false, default: 5 })
  tickets: number;

  @Column({ nullable: true })
  @IsOptional()
  languageCode?: string;

  @Column({ nullable: true })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP()' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
  })
  updatedAt: Date;
}
