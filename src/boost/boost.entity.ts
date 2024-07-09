import { BoostLevelType } from 'src/utils/constants';
import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity({ name: 'boost' })
export class BoostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  cost: number;

  @Column({ nullable: false })
  rate: number;

  @Column({ nullable: true, default: 0 })
  level: BoostLevelType;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
  })
  updatedAt: Date;
}
