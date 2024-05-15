import slugify from 'slugify';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { uuidGenerate } from '../helpers';
import { Category } from './category.entity';
import { Model } from './model.entity';
import { Vehicle } from './vehicle.entity';
import { VehicleRequirement } from './user-vehicle-requirement.entity';
import { VehicleDetail } from './user-vehicle-detail.entity';
import { Min } from 'class-validator';
import { Faq } from './faq.entity';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  brand: string;

  @Column()
  slug: string;

  @Column({ nullable: false })
  image: string;

  @Column({ default: 0 })
  totalView: number;

  @Column()
  description: string;

  @Column({ default: false })
  featured: boolean;

  @Column({ nullable: true, default: null })
  @Min(1, { message: 'Position cannot be less than 1' })
  position: number;

  @ManyToMany(() => Category, (category) => category.brands)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Model, (model) => model.brand)
  models: Array<Model>;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.brand)
  vehicles: Array<Vehicle>;

  @OneToMany(() => VehicleRequirement, (requirement) => requirement.brand)
  vehicleRequirements: Array<VehicleRequirement>;

  @OneToMany(() => VehicleDetail, (detail) => detail.brand)
  vehicleDetails: Array<VehicleDetail>;

  @OneToMany(() => Faq, (faq) => faq.brand)
  faq: Array<Faq>;

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
    this.trimBrand();
    this.updateSlugFromBrand();
  }

  trimBrand(): void {
    if (this.brand) this.brand = this.brand.trim();
  }
  updateSlugFromBrand(): void {
    this.slug = slugify(this.brand).toLowerCase().trim();
  }

  @BeforeInsert()
  async generateId(): Promise<void> {
    this.id = await uuidGenerate();
  }
}
