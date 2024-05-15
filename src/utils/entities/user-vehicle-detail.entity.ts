import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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
export class VehicleDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: VehicleCondition,
    default: VehicleCondition.NEW,
  })
  condition: VehicleCondition;

  @ManyToOne(() => Category, (category) => category.vehicleDetails)
  category: Category;

  @ManyToOne(() => Brand, (brand) => brand.vehicleDetails)
  brand: Brand;

  @ManyToOne(() => Model, (model) => model.vehicleDetail)
  model: Model;

  @ManyToOne(() => Users, (user) => user.vehicleDetail)
  user: Users;

  @Column({ nullable: false })
  year: number;

  @Column({ nullable: false })
  transmission: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  phoneNumber: string;

  @Column('simple-array', { nullable: true })
  images: Array<string>;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt: Date;

  @BeforeInsert()
  async generateId() {
    this.id = await uuidGenerate();
  }
}
