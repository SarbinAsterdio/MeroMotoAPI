import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Variant } from '.';
import { AirBags, BrakeType } from '../common/variant.enum';

@Entity()
export class SafetyAndFeatures {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, default: false })
  antiLockBrakingSystem: boolean;

  @Column({ nullable: true, default: false })
  centralLocking: boolean;

  @Column({ nullable: true, default: false })
  childSafetyLocks: boolean;

  @Column({ nullable: true, default: false })
  powerDoorLocks: boolean;

  @Column({ type: 'enum', enum: AirBags, nullable: true, default: null })
  noOfAirbags: AirBags;

  @Column({ nullable: true, default: false })
  driverAirbag: boolean;

  @Column({ nullable: true, default: false })
  passengerAirbag: boolean;

  @Column({ nullable: true, default: false })
  rearSeatBelts: boolean;

  @Column({ nullable: true, default: false })
  dayAndNightRearViewMirror: boolean;

  @Column({ nullable: true, default: false })
  passengerSideRearViewMirror: boolean;

  @Column({ nullable: true, default: false })
  seatBeltWarning: boolean;

  @Column({ nullable: true, default: false })
  doorAjarWarning: boolean;

  @Column({ nullable: true, default: false })
  adjustableSeats: boolean;

  @Column({ nullable: true, default: false })
  engineImmobilizer: boolean;

  @Column({ nullable: true, default: false })
  crashSensor: boolean;

  @Column({ nullable: true, default: false })
  engineCheckWarning: boolean;

  @Column({ nullable: true, default: false })
  tyrePressureMonitor: boolean;

  @Column({ nullable: true, default: false })
  automaticHeadlamps: boolean;

  @Column({ nullable: true, default: false })
  EBD: boolean;

  @Column({ nullable: true, default: false })
  speedAlert: boolean;

  @Column({ nullable: true, default: false })
  advanceSafetyFeatures: boolean;

  @Column({ nullable: true, default: false })
  followMeHomeHeadlamps: boolean;

  @Column({ nullable: true, default: false })
  rearCamera: boolean;

  @Column({ nullable: true, default: false })
  speedSensingAutoDoorLock: boolean;

  @Column({ nullable: true, default: false })
  impactSensingAutoDoorUnlock: boolean;

  @Column({ nullable: true, default: false })
  pretensionersAndForceLimiterSeatbelts: boolean;

  @Column({ type: 'enum', enum: BrakeType, nullable: true, default: null })
  brakingType: BrakeType;

  @Column({ nullable: true, default: false })
  chargingPoint: string;

  @Column({ nullable: true, default: null })
  seatType: string;

  @Column({ nullable: true, default: false })
  artificialExaustSoundSystem: boolean;

  @Column({ nullable: true, default: false })
  bodyGraphics: boolean;

  @OneToOne(() => Variant, (v) => v.safetyAndFeatures)
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
