import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { SafetyAndFeatures } from './safety-and-features.entity';
import { Exterior } from './exterior.entity';
import { Interior } from './interior.entity';
import { MotorAndBattery } from './motor-and-battery.entity';
import { DimensionAndCapacity } from './dimension-and-capacity.entity';
import { SuspensionSteeringAndBrake } from './suspension-steering-and-brake.entity';
import slugify from 'slugify';
import { uuidGenerate } from '../helpers';
import { Category } from './category.entity';
import { Model } from './model.entity';
import { Vehicle } from './vehicle.entity';
import { EngineAndTransmission } from './engine-and-transmission.entity';
import { FuelAndPerformance } from './fuel-and-performance.entity';
import { ComfortAndConvenience } from './comfort-and-convenience.entity';
import { EntertainmentAndCommunication } from './entertainment-and-communication.entity';

@Entity()
export class Variant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  variant: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: 0 })
  totalView: number;

  @Column({ nullable: true })
  image: string;

  @Column()
  description: string;

  @ManyToOne(() => Category, (category) => category.variants)
  category: Category;

  @ManyToOne(() => Model, (model) => model.variants)
  model: Model;

  @ManyToMany(() => Vehicle, (vehicle) => vehicle.variants)
  @JoinTable()
  vehicles: Array<Vehicle>;

  @Column({ type: 'boolean', default: false })
  featured: boolean;

  @Column({ type: 'boolean', default: false })
  baseVariant: boolean;

  @Column({ nullable: false })
  price: number;

  @OneToOne(() => EngineAndTransmission, (i) => i.variant, { eager: true })
  @JoinColumn()
  engineAndTransmission: EngineAndTransmission;

  @OneToOne(() => FuelAndPerformance, (f) => f.variant, { eager: true })
  @JoinColumn()
  fuelAndPerformance: FuelAndPerformance;

  @OneToOne(() => SuspensionSteeringAndBrake, (f) => f.variant, { eager: true })
  @JoinColumn()
  suspensionSteeringAndBrake: SuspensionSteeringAndBrake;

  @OneToOne(() => DimensionAndCapacity, (f) => f.variant, { eager: true })
  @JoinColumn()
  dimensionAndCapacity: DimensionAndCapacity;

  @OneToOne(() => MotorAndBattery, (f) => f.variant, { eager: true })
  @JoinColumn()
  motorAndBattery: MotorAndBattery;

  @OneToOne(() => ComfortAndConvenience, (f) => f.variant, { eager: true })
  @JoinColumn()
  comfortAndConvenience: ComfortAndConvenience;

  @OneToOne(() => Interior, (f) => f.variant, { eager: true })
  @JoinColumn()
  interior: Interior;

  @OneToOne(() => Exterior, (f) => f.variant, { eager: true })
  @JoinColumn()
  exterior: Exterior;

  @OneToOne(() => SafetyAndFeatures, (f) => f.variant, { eager: true })
  @JoinColumn()
  safetyAndFeatures: SafetyAndFeatures;

  @OneToOne(() => EntertainmentAndCommunication, (f) => f.variant, {
    eager: true,
  })
  @JoinColumn()
  entertainmentAndCommunication: EntertainmentAndCommunication;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  beforeInsertOrUpdate(): void {
    this.updateSlugFromName();
    this.trimName();
  }

  updateSlugFromName(): void {
    this.slug = slugify(this.variant).toLowerCase().trim();
  }
  trimName(): void {
    if (this.variant) this.variant = this.variant.trim();
  }

  @BeforeInsert()
  async generateId() {
    this.id = await uuidGenerate();
  }
}
