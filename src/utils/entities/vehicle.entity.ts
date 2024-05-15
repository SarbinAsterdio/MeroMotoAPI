import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ColumnNumberTransformer } from '../common/common-data-transform';
import { VehicleCondition } from '../common/common.enum';
import { SeatingCapacity } from '../common/variant.enum';
import { uuidGenerate } from '../helpers';
import {
  CatType,
  UsedVehicleCondition,
  VehicleOwner,
} from '../common/common.enum';
import {
  AvailableColor,
  BodyType,
  Brand,
  CallBack,
  Category,
  Favorite,
  Model,
  RatingAndReview,
  Variant,
} from './index';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ default: 0 })
  totalView: number;

  @Column({ default: 0 })
  totalSearch: number;

  @Column({
    type: 'enum',
    enum: VehicleCondition,
    default: VehicleCondition.NEW,
  })
  condition: VehicleCondition;

  @Column({ default: false })
  featured: boolean;

  @Column({ type: 'boolean', nullable: true, default: false })
  certified: boolean | null;

  @Column({ type: 'boolean', nullable: true, default: false })
  approved: boolean | null;

  @Column()
  description: string;

  @Column({
    type: 'bigint',
    nullable: true,
    transformer: new ColumnNumberTransformer(),
  })
  minPrice: number;

  @Column({
    type: 'bigint',
    default: 0,
    transformer: new ColumnNumberTransformer(),
  })
  maxPrice: number;

  @Column({ nullable: true })
  position: number;

  @Column({ nullable: false, default: 2010 })
  year: number;

  @Column({
    nullable: true,
    default: 0,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  maxMileage: number;

  @Column({
    nullable: true,
    default: 0,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  minMileage: number;

  @Column({
    nullable: true,
    default: null,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  }) //for used cars km run only
  usedVehicleTotalMileage: number | null;

  @Column({
    nullable: true,
    default: 0,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  maxEngineDisplacement: number;

  @Column({
    nullable: true,
    default: 0,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  minEngineDisplacement: number;

  @Column({
    nullable: true,
    default: 0,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  minBHP: number;

  @Column({
    nullable: true,
    default: 0,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  maxBHP: number;

  @Column({
    type: 'enum',
    enum: SeatingCapacity,
    nullable: true,
    default: SeatingCapacity.ONE,
  })
  seats: SeatingCapacity;

  @Column({
    nullable: true,
    default: 0,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  torque: number;

  @Column({ nullable: true, default: 150 })
  topSpeed: number;

  @Column('simple-array', { nullable: true })
  brakes: Array<string>;

  @Column({ nullable: true })
  tyreType: string | null;

  @Column({
    nullable: true,
    default: 0,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  fuelTank: number;

  @Column({
    nullable: true,
    default: 0,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  batteryRange: number | null;

  @Column({
    nullable: true,
    default: 0,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  bootSpace: number | null;

  @Column({
    nullable: true,
    default: 0,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  batteryCapacity: number;

  @Column({ nullable: false, default: false })
  isElectric: boolean;

  @Column({
    nullable: true,
    default: 0,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumberTransformer(),
  })
  chargingTime0to80: number;

  @Column({ nullable: true, default: null })
  view360: string;

  @Column({ nullable: true, default: null })
  video: string;

  @Column({ nullable: true, default: null })
  location: string;

  @Column({ nullable: true, default: null })
  registerYear: number;

  @Column({ nullable: true, default: null })
  motorPower: number;

  @Column({ nullable: true, default: null })
  motor: string;

  @Column({ nullable: true, default: null })
  acceleration: string;

  @Column({ type: 'enum', enum: CatType, default: CatType.FOURWHEELER })
  type: CatType;

  @Column('simple-array', { nullable: true, default: null })
  fuelType: Array<string>;

  @Column('simple-array', { nullable: true, default: null })
  features: Array<string>;

  @Column('simple-array', { nullable: true, default: null })
  blueBookImages: Array<string>;

  @Column('simple-array', { nullable: true, default: null })
  roadTaxImages: Array<string>;

  @Column('simple-array', { nullable: true, default: null })
  insuranceImages: Array<string>;

  @Column('simple-array', { nullable: true, default: null }) // 4WD AWD RWD FWD
  trim: Array<string>;

  @Column('simple-array', { nullable: true, default: null }) //automatic semin manual
  transmission: Array<string>;

  @Column('simple-array', { nullable: false })
  images: Array<string>;

  @Column('simple-array', { nullable: true, default: null })
  variantImages: Array<string>;

  @Column('simple-array', { nullable: true, default: null })
  exteriorImages: Array<string>;

  @Column('simple-array', { nullable: true, default: null })
  interiorImages: Array<string>;

  @Column({
    type: 'enum',
    enum: UsedVehicleCondition,
    default: UsedVehicleCondition.GOOD,
  })
  vehicleCondition: UsedVehicleCondition;

  @Column({
    type: 'enum',
    enum: VehicleOwner,
    default: VehicleOwner.FIRST_OWNER,
  })
  vehicleOwner: VehicleOwner;

  @Column({ nullable: false, default: false })
  upcoming: boolean;

  @Column({ type: 'timestamp', nullable: true, default: null })
  expectedLaunchDate: Date;

  @ManyToMany(() => AvailableColor, (av) => av.vehicle)
  @JoinTable()
  availableColors: Array<AvailableColor>;

  @ManyToOne(() => Category, (category) => category.vehicles)
  category: Category;

  @ManyToOne(() => Model, (model) => model.vehicles)
  model: Model;

  @ManyToOne(() => Brand, (brand) => brand.vehicles)
  brand: Brand;

  @ManyToOne(() => BodyType, (bt) => bt.vehicles)
  bodyType: BodyType;

  @ManyToMany(() => Variant, (variant) => variant.vehicles)
  variants: Array<Variant>;

  @OneToMany(
    () => RatingAndReview,
    (ratingAndReview) => ratingAndReview.vehicleId,
  )
  rating: Array<RatingAndReview>;

  @OneToMany(() => Favorite, (favorite) => favorite.vehicle)
  favorites: Array<Favorite>;

  @OneToMany(() => CallBack, (callback) => callback.vehicle)
  callback: Array<CallBack>;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeInsert()
  async generateId() {
    this.id = await uuidGenerate();
  }
}
