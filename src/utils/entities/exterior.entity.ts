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
  HeadlightType,
  TailLightType,
  TurnSignalType,
} from '../common/variant.enum';

@Entity()
export class Exterior {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, default: false })
  adjustableHeadlights: boolean;

  @Column({ nullable: true, default: false })
  fogLightsFront: boolean;

  @Column({ nullable: true, default: false })
  powerAdjustableExteriorRearViewMirror: boolean;

  @Column({ nullable: true, default: false })
  manuallyAdjustableExtRearViewMirror: boolean;

  @Column({ nullable: true, default: false })
  electricFoldingRearViewMirror: boolean;

  @Column({ nullable: true, default: false })
  rainSensingWiper: boolean;

  @Column({ nullable: true, default: false })
  rearWindowWasher: boolean;

  @Column({ nullable: true, default: false })
  rearWindowWiper: boolean;

  @Column({ nullable: true, default: false })
  rearWindowDefogger: boolean;

  @Column({ nullable: true, default: false })
  wheelCovers: boolean;

  @Column({ nullable: true, default: false })
  alloyWheels: boolean;

  @Column({ nullable: true, default: false })
  powerAntenna: boolean;

  @Column({ nullable: true, default: false })
  tintedGlass: boolean;

  @Column({ nullable: true, default: false })
  outsideRearViewMirrorTurnIndicators: boolean;

  @Column({ nullable: true, default: false })
  intergratedAntenna: boolean;

  @Column({ nullable: true, default: false })
  chromeGrille: boolean;

  @Column({ nullable: true, default: false })
  chromeGarnish: boolean;

  @Column({ nullable: true, default: false })
  projectorHeadlamps: boolean;

  @Column({ nullable: true, default: false })
  halogenHeadlamps: boolean;

  @Column({ nullable: true, default: false })
  ledDRL: boolean;

  @Column({ nullable: true, default: false })
  drl: boolean;

  @Column({ type: 'enum', enum: TailLightType, nullable: true, default: null })
  tailLight: TailLightType;

  @Column({ type: 'enum', enum: HeadlightType, nullable: true, default: null })
  headLight: HeadlightType;

  @Column({ type: 'enum', enum: TurnSignalType, nullable: true, default: null })
  turnSignalLamp: TurnSignalType;

  @Column({ nullable: true, default: false })
  ledTailLight: boolean;

  @Column({ nullable: true, default: false })
  lowBatteryIndicator: boolean;

  @Column('simple-array', { nullable: true, default: null })
  images: Array<string> | null;

  @Column('simple-array', { nullable: true, default: null })
  additionalFeatures: Array<string> | null;

  @OneToOne(() => Variant, (v) => v.exterior)
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
