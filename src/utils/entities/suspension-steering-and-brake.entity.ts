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
  ABS,
  BrakeType,
  FrameDesign,
  FrontSuspensionSystem,
  RearSuspensionSystem,
  SteeringGearType,
  SteeringType,
} from '../common/variant.enum';
import { ColumnNumberTransformer } from '../common/common-data-transform';

@Entity()
export class SuspensionSteeringAndBrake {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: SteeringType, nullable: true, default: null })
  steeringType: SteeringType;

  @Column({
    type: 'enum',
    enum: SteeringGearType,
    nullable: true,
    default: null,
  })
  steeringGearType: SteeringGearType;

  @Column({ nullable: true, default: null })
  steeringColumn: string;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  minimumTurningRadius: number;

  @Column({
    type: 'enum',
    enum: RearSuspensionSystem,
    nullable: true,
    default: null,
  })
  rearSuspension: RearSuspensionSystem;

  @Column({
    type: 'enum',
    enum: FrontSuspensionSystem,
    nullable: true,
    default: null,
  })
  frontSuspension: FrontSuspensionSystem;

  @Column({ type: 'enum', enum: BrakeType, nullable: true, default: null })
  frontBrakeType: BrakeType;

  @Column({ type: 'enum', enum: BrakeType, nullable: true, default: null })
  rearBrakeType: BrakeType;

  @Column({ nullable: true, default: null })
  shockAbsorbersType: string;

  @Column({ nullable: true, default: '' })
  bodyType: string;

  @Column({ nullable: true, default: null })
  platform: string;

  @Column({ type: 'enum', enum: FrameDesign, nullable: true, default: null })
  frame: FrameDesign;

  @Column({ type: 'enum', enum: ABS, nullable: true, default: null })
  abs: ABS;

  @Column({ nullable: true, default: null })
  frontBrakeDiameter: number;

  @Column({ nullable: true, default: null })
  rearBrakeDiameter: number;

  @Column({ nullable: true, default: false })
  radialTyre: boolean;

  @Column({ nullable: true, default: null })
  tyreSize: string;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  wheelSize: number;

  @Column({ nullable: true, default: null })
  wheelType: string;

  @Column({ nullable: true, default: false })
  tubelessTyre: boolean | null;

  @OneToOne(() => Variant, (v) => v.suspensionSteeringAndBrake)
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
