import slugify from 'slugify';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { uuidGenerate } from '../helpers';
import { Brand } from './brand.entity';
import { Model } from './model.entity';
import { BodyType } from './bodytype.entity';
import { Vehicle } from './vehicle.entity';
import { VehicleRequirement } from './user-vehicle-requirement.entity';
import { CatType } from '../common/common.enum';
import { VehicleDetail } from './user-vehicle-detail.entity';
import { Variant } from '.';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column()
  image: string;

  @Column()
  slug: string;

  @Column({ type: 'enum', enum: CatType, default: CatType.FOURWHEELER })
  type: CatType;

  @Column({ default: 'category_icon.webp' })
  icon: string;

  @Column({ default: false })
  featured: boolean;

  @Column({ default: false })
  searchable: boolean;

  @ManyToMany(() => BodyType, (bodyType) => bodyType.categories)
  bodyTypes: BodyType[];

  @ManyToMany(() => Brand, (brand) => brand.categories)
  brands: Brand[];

  @ManyToMany(() => Model, (model) => model.category)
  models: Array<Model>;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.category)
  vehicles: Array<Vehicle>;

  @OneToMany(() => Variant, (variant) => variant.category)
  variants: Array<Variant>;

  @OneToMany(() => VehicleRequirement, (requirement) => requirement.category)
  vehicleRequirements: Array<VehicleRequirement>;

  @OneToMany(() => VehicleDetail, (detail) => detail.category)
  vehicleDetails: Array<VehicleDetail>;

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
    this.slug = slugify(this.name).toLowerCase().trim();
  }
  trimName(): void {
    if (this.name) this.name = this.name.trim();
  }

  @BeforeInsert()
  async generateId() {
    this.id = await uuidGenerate();
  }
}
