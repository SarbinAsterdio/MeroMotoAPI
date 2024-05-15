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
import { Vehicle } from './vehicle.entity';
import { Model } from '.';

@Entity()
export class BodyType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  bodyType: string;

  @Column()
  image: string;

  @Column()
  slug: string;

  @ManyToMany(() => Category, (category) => category.bodyTypes)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.bodyType)
  vehicles: Array<Vehicle>;

  @OneToMany(() => Model, (model) => model.bodyType)
  models: Array<Model>;

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
    this.updateSlugFromBodyType();
    this.trimBodyType();
  }
  updateSlugFromBodyType(): void {
    this.slug = slugify(this.bodyType).toLowerCase().trim();
  }
  trimBodyType(): void {
    this.bodyType = this.bodyType.trim();
  }

  @BeforeInsert()
  async generateId(): Promise<void> {
    this.id = await uuidGenerate();
  }
}
