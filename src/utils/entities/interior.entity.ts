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
export class Interior {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, default: false })
  electronicMultiTripmeter: boolean;

  @Column({ nullable: true, default: false })
  leatherSeats: boolean;

  @Column({ nullable: true, default: false })
  fabricUpholstery: boolean;

  @Column({ nullable: true, default: false })
  digitalClock: boolean;

  @Column({ nullable: true, default: false })
  leatherSteeringWheel: boolean;

  @Column({ nullable: true, default: false })
  gloveCompartment: boolean;

  @Column({ nullable: true, default: false })
  digitalOdometer: boolean;

  @Column({ nullable: true, default: false })
  heightAdjustableDriverSeat: boolean;

  @Column({ nullable: true, default: false })
  dualToneDashboard: boolean;

  @Column('simple-array', { nullable: true, default: null })
  images: Array<string> | null;

  @Column('simple-array', { nullable: true, default: null })
  additionalFeatures: Array<string> | null;

  @OneToOne(() => Variant, (v) => v.interior)
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
