import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Variant } from '.';

@Entity()
export class ComfortAndConvenience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, default: false })
  powerSteering: boolean;

  @Column({ nullable: true, default: false })
  powerWindowsFront: boolean;

  @Column({ nullable: true, default: false })
  powerWindowsRear: boolean;

  @Column({ nullable: true, default: false })
  powerBoot: boolean;

  @Column({ nullable: true, default: false })
  airConditioner: boolean;

  @Column({ nullable: true, default: false })
  heater: boolean;

  @Column({ nullable: true, default: false })
  adjustableSteering: boolean;

  @Column({ nullable: true, default: false })
  automaticClimateControl: boolean;

  @Column({ nullable: true, default: false })
  lowFuelWarningLight: boolean;

  @Column({ nullable: true, default: false })
  accessoryPowerOutlet: boolean;

  @Column({ nullable: true, default: false })
  vanityMirror: boolean;

  @Column({ nullable: true, default: false })
  rearSeatHeadrest: boolean;

  @Column({ nullable: true, default: false })
  adjustableHeadrest: boolean;

  @Column({ nullable: true, default: false })
  rearSeatCentreArmRest: boolean;

  @Column({ nullable: true, default: false })
  cupHoldersRear: boolean;

  @Column({ nullable: true, default: false })
  cupHolderFront: boolean;

  @Column({ nullable: true, default: false })
  parkingSensors: boolean;

  @Column({ nullable: true, default: false })
  cruiseControl: boolean;

  @Column({ nullable: true, default: false })
  findMyCarLoaction: boolean;

  @Column({ nullable: true, default: false })
  smartAccessCardEntry: boolean;

  @Column({ nullable: true, default: false })
  keyLessEntry: boolean;

  @Column({ nullable: true, default: false })
  engineStartOrStopButton: boolean;

  @Column({ nullable: true, default: false })
  handsFreeTailgate: boolean;

  @Column('simple-array', { nullable: true, default: [] })
  driveModes: Array<string>;

  @Column({ nullable: true, default: false })
  gloveBoxCooling: boolean;

  @Column({ nullable: true, default: false })
  voiceControl: boolean;

  @Column({ nullable: true, default: false })
  gearShiftIndicator: boolean;

  @Column({ nullable: true, default: false })
  rearCurtain: boolean;

  @Column({ nullable: true, default: false })
  luggageHookAndNet: boolean;

  @Column({ nullable: true, default: false })
  mobileApplication: boolean;

  @Column({ nullable: true, default: false })
  speedometer: boolean;

  @Column({ nullable: true, default: false })
  tachometer: boolean;

  @Column({ nullable: true, default: false })
  tripmeter: boolean;

  @Column({ nullable: true, default: false })
  fuelGauge: boolean;

  @Column({ nullable: true, default: false })
  clock: boolean;

  @Column({ nullable: true, default: false })
  passengerFootrest: boolean;

  @Column({ nullable: true, default: false })
  engineKillSwitch: boolean;

  @Column({ nullable: true, default: false })
  instrumentConsole: boolean;

  @Column({ nullable: true, default: false })
  navigation: boolean;

  @Column({ nullable: true, default: false })
  geoFencing: boolean;

  @OneToOne(() => Variant, (v) => v.comfortAndConvenience)
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
