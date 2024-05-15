import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Variant } from '.';
import {
  ClutchType,
  CoolingSystem,
  DriveType,
  EngineType,
  FuelSupply,
  GearBox,
  NumberOfCylinders,
  Starting,
  Transmission,
  Trim,
  ValvesPerCylinder,
} from '../common/variant.enum';
import { ColumnNumberTransformer } from '../common/common-data-transform';

@Entity()
export class EngineAndTransmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: EngineType, nullable: true, default: null })
  engineType: EngineType;

  @Column({ type: 'enum', enum: Transmission, nullable: true, default: null })
  transmission: Transmission;

  @Column({ type: 'enum', enum: Trim, nullable: true, default: null })
  trim: Trim;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  engineDisplacement: number;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  mileage: number;

  @Column({
    type: 'enum',
    enum: NumberOfCylinders,
    nullable: true,
    default: null,
  })
  noOfCylinder: NumberOfCylinders;

  @Column({
    type: 'enum',
    enum: ValvesPerCylinder,
    nullable: true,
    default: null,
  })
  valvesPerCylinder: ValvesPerCylinder;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  maximumTorque: number;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  torqueRPM: number;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  powerRPM: number;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  maximumPower: number;

  @Column({ type: 'enum', enum: GearBox, nullable: true, default: null })
  gearBox: GearBox;

  @Column({ type: 'enum', enum: DriveType, nullable: true, default: null })
  driveType: DriveType;

  @Column({ type: 'enum', enum: CoolingSystem, nullable: true, default: null })
  coolingSystem: CoolingSystem;

  @Column({ type: 'enum', enum: Starting, nullable: true, default: null })
  starting: Starting;

  @Column({ type: 'enum', enum: FuelSupply, nullable: true, default: null })
  fuelSupply: FuelSupply;

  @Column({ type: 'enum', enum: ClutchType, nullable: true, default: null })
  clutch: ClutchType;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  bore: number | null;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  stroke: number | null;

  @Column({ nullable: true, default: null })
  compressionRatio: string | null;

  @Column({ nullable: true, default: null })
  emmissionType: string | null;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  batteryCapacity: number | null;

  @Column({ nullable: true, default: null })
  motorType: string | null;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  motorPower: number | null;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  range: number | null;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  chargingTimeAC: number | null;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  chargingTimeDC: number | null;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  chargingTime0to80: number | null;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  chargingTime0to100: number | null;

  @Column({ nullable: true, default: false })
  fastCharging: boolean | null;

  @Column({ nullable: true, default: null })
  chargingPort: string | null;

  @OneToOne(() => Variant, (v) => v.engineAndTransmission)
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
