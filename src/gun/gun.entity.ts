import { UserEntity } from 'src/user/user.entity';
import { GUN_TYPE } from 'src/utils/constants';
import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'gun' })
export class GunEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  title: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: GUN_TYPE,
    default: GUN_TYPE.GUN_BLACK,
  })
  gunType: GUN_TYPE;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    onUpdate: 'CURRENT_TIMESTAMP()',
  })
  updatedAt: Date;
}
