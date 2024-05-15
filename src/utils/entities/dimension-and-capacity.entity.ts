import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Variant } from '.';
import { Doors, SeatingCapacity } from '../common/variant.enum';
import { ColumnNumberTransformer } from '../common/common-data-transform';
@Entity()
export class DimensionAndCapacity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  length: number | null;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  width: number | null;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  height: number | null;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  bootSpace: number | null;

  @Column({
    type: 'enum',
    enum: SeatingCapacity,
    nullable: true,
    default: null,
  })
  seatingCapacity: SeatingCapacity;

  @Column({ nullable: true, default: null })
  groundClearance: number;

  @Column({ type: 'enum', enum: Doors, nullable: true, default: null })
  noOfDoors: Doors;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  fuelCapacity: number;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  saddleHeight: number;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  wheelbase: number;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  kerbWeight: number;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  loadCarryingCapacity: number;

  @OneToOne(() => Variant, (v) => v.dimensionAndCapacity)
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
