import slugify from 'slugify';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { uuidGenerate } from '../helpers';
import { Category } from './category.entity';
import { Brand } from './brand.entity';
import { Variant } from './variant.entity';
import { Vehicle } from './vehicle.entity';
import { VehicleRequirement } from './user-vehicle-requirement.entity';
import { VehicleDetail } from './user-vehicle-detail.entity';
import { AvailableColor } from './available-color.entity';
import { BodyType } from './bodytype.entity';
import { Faq } from './faq.entity';

@Entity()
export class Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  model: string;

  @Column()
  slug: string;

  @ManyToMany(() => Category, (category) => category.models)
  @JoinTable()
  category: Array<Category>;

  @ManyToOne(() => Brand, (brand) => brand.models)
  brand: Brand;

  @OneToMany(() => Variant, (variant) => variant.model)
  variants: Array<Variant>;

  @OneToMany(() => Faq, (faq) => faq.model)
  faq: Array<Faq>;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.model)
  vehicles: Array<Vehicle>;

  @ManyToOne(() => BodyType, (bt) => bt.models)
  bodyType: BodyType;

  @Column({ default: 0 })
  totalView: number;

  @Column({ nullable: false })
  year: number;

  @Column({ nullable: false, default: false })
  isElectric: boolean;

  @OneToMany(() => AvailableColor, (av) => av.model)
  availableColors: Array<AvailableColor>;

  @OneToMany(() => VehicleRequirement, (requirement) => requirement.model)
  vehicleRequirement: VehicleRequirement;

  @OneToMany(() => VehicleDetail, (detail) => detail.model)
  vehicleDetail: VehicleDetail;

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
    this.trimAndLowerCaseName();
  }

  updateSlugFromName(): void {
    this.slug = slugify(this.model).toLowerCase().trim();
  }
  trimAndLowerCaseName(): void {
    if (this.model) this.model = this.model.trim();
  }

  @BeforeInsert()
  async generateId() {
    this.id = await uuidGenerate();
  }
}
