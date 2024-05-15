import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { uuidGenerate } from '../helpers';
import { Colors } from './color.entity';
import { Model, Vehicle } from '.';

@Entity()
export class AvailableColor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Model, (model) => model.availableColors, { cascade: true })
  @JoinTable()
  model: Model;

  @ManyToMany(() => Vehicle, (vehicle) => vehicle.availableColors)
  vehicle: Vehicle[];

  @ManyToOne(() => Colors, (color) => color.availableColor)
  color: Colors;

  @Column({ nullable: false })
  image: string;

  @Column({ nullable: false })
  name: string;

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
