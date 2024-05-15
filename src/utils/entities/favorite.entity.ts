import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  BeforeInsert,
} from 'typeorm';
import { Users, Vehicle } from '.';
import { uuidGenerate } from '../helpers';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  isFavorite: boolean;

  @ManyToOne(() => Users, (user) => user.favorites)
  user: Users;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.favorites)
  vehicle: Vehicle;

  @BeforeInsert()
  async genereateId() {
    this.id = await uuidGenerate();
  }
}
