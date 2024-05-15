import slugify from 'slugify';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { uuidGenerate } from '../helpers';
import { VehicleRequirement } from './user-vehicle-requirement.entity';
import { VehicleDetail } from './user-vehicle-detail.entity';
import { From, UserRole } from '../common/common.enum';
import { Favorite } from './favorite.entity';
import { RatingAndReview } from './rating.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true, unique: true })
  slug: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  // @ManyToOne(() => Role, (role) => role.users)
  // role: Role;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;

  @OneToMany(() => VehicleRequirement, (requirement) => requirement.model)
  vehicleRequirement: VehicleRequirement;

  @OneToMany(() => VehicleDetail, (detail) => detail.user)
  vehicleDetail: VehicleDetail;

  @Column({ type: 'enum', enum: From, default: From.PHONE })
  from: From;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ type: 'boolean', default: false })
  newUser: boolean;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'boolean', default: false })
  phoneNumberVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ nullable: true })
  loginOTP: number;

  @Column({ type: 'boolean', default: false })
  alertNotification: boolean;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Array<Favorite>;

  @OneToOne(() => RatingAndReview, (rating) => rating.user)
  ratingAndReview: RatingAndReview;

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
  updateSlugFromName(): void {
    if (this.name) {
      const nameSlug = slugify(this.name).toLowerCase().trim();
      const numberSlug = Math.floor(Math.random() * 900000) + 100000;
      this.slug = nameSlug + numberSlug;
    }
  }
  @BeforeInsert()
  async generateId(): Promise<void> {
    this.id = await uuidGenerate();
  }
}
