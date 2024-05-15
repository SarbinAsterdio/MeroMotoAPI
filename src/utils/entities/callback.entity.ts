import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';
import { uuidGenerate } from '../helpers';
import { Vehicle } from './vehicle.entity';
import { Brand } from '.';

@Entity()
export class CallBack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  phoneNumber: string;

  @Column({ nullable: false, default: false })
  verified: boolean;

  @Column({ nullable: true })
  remarks: string;

  @ManyToOne(() => Vehicle)
  vehicle: Vehicle;

  @ManyToOne(() => Brand)
  brand: Brand;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeInsert()
  async generateId() {
    this.id = await uuidGenerate();
  }
}
