import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users, Vehicle } from '.';

@Entity()
export class RatingAndReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.rating, {
    onDelete: 'CASCADE',
  })
  vehicleId: Vehicle;

  @Column()
  rating: number;

  @Column()
  name: string;

  @Column()
  mobileNumber: string;

  @Column()
  reviewMessage: string;

  @Column({ default: false })
  verified: boolean;

  @OneToOne(() => Users, (user) => user.ratingAndReview)
  @JoinColumn()
  user: Users;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
