import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Variant } from '.';
import { Speakers } from '../common/variant.enum';
import { ColumnNumberTransformer } from '../common/common-data-transform';

@Entity()
export class EntertainmentAndCommunication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, default: false })
  radio: boolean;

  @Column({ nullable: true, default: false })
  speakersFront: boolean;

  @Column({ nullable: true, default: false })
  speakersRear: boolean;

  @Column({ nullable: true, default: false })
  externalSpeakers: boolean;

  @Column({ nullable: true, default: false })
  integrated2DINAudio: boolean;

  @Column({ nullable: true, default: false })
  usbAndAuxiliaryInput: boolean;

  @Column({ nullable: true, default: false })
  bluetoothConnectivity: boolean;

  @Column({ nullable: true, default: false })
  touchScreen: boolean;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  touchScreenSize: number;

  @Column({ nullable: true, default: false })
  connectivity: boolean;

  @Column({ nullable: true, default: false })
  androidAuto: boolean;

  @Column({ nullable: true, default: false })
  appleCarPlay: boolean;

  @Column({ type: 'enum', enum: Speakers, nullable: true, default: null })
  noOfSpeakers: Speakers;

  @Column('simple-array', { nullable: true, default: null })
  additionalFeatures: Array<string> | null;

  @OneToOne(() => Variant, (v) => v.entertainmentAndCommunication)
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
