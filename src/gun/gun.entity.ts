import { GUN_TYPE } from 'src/utils/constants';
import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity({ name: 'gun' })
export class GunEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', nullable: false })
  price: number;

  @Column({ nullable: false })
  title: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: GUN_TYPE,
  })
  type: GUN_TYPE;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
  })
  updatedAt: Date;
}
