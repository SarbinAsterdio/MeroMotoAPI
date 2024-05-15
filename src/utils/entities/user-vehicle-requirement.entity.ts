import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Brand } from './brand.entity';
import { Model } from './model.entity';
import { uuidGenerate } from '../helpers';
import { Users } from './user.entity';
import { VehicleCondition } from '../common/common.enum';

@Entity()
export class VehicleRequirement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: VehicleCondition,
    default: VehicleCondition.NEW,
  })
  condition: VehicleCondition;

  @Column({ nullable: true, default: null })
  remarks: string;

  @ManyToOne(() => Category, (category) => category.vehicleRequirements)
  category: Category;

  @ManyToOne(() => Brand, (brand) => brand.vehicleRequirements)
  brand: Brand;

  @ManyToOne(() => Model, (model) => model.vehicleRequirement)
  model: Model;

  @ManyToOne(() => Users, (user) => user.vehicleRequirement)
  user: Users;

  @Column({ nullable: false })
  year: number;

  @Column({ type: 'bigint', nullable: false, default: 0 })
  minBudget: number;

  @Column({ type: 'bigint', nullable: false, default: 0 })
  maxBudget: number;

  @Column({ nullable: false })
  transmission: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  phoneNumber: string;

  @Column({ nullable: false })
  description: string;

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
