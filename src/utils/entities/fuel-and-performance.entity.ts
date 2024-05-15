import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Variant } from '.';
import { FuelType } from '../common/variant.enum';
import { ColumnNumberTransformer } from '../common/common-data-transform';

@Entity()
export class FuelAndPerformance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: FuelType, nullable: true, default: null })
  fuelType: FuelType;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  cngMileage: number;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  cngHighwayMileage: number;

  @Column({ nullable: true, default: null })
  emissionNormCompliance: string;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  topSpeed: number;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  acceleration: number;

  @OneToOne(() => Variant, (v) => v.fuelAndPerformance)
  variant: Variant;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
