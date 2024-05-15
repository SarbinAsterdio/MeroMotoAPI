import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { uuidGenerate } from '../helpers';
import { NavItemChild } from './navItem-child.entity';
import { Min } from 'class-validator';
import { NavItemType } from '../common/common.enum';

@Entity()
export class NavItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  link: string;

  @Column({ default: false })
  featured: boolean;

  @Column({ default: null })
  @Min(1, { message: 'Position cannot be less than 1' })
  position: number;

  @Column({ type: 'enum', enum: NavItemType, default: NavItemType.NORMAL })
  type: NavItemType;

  @OneToMany(() => NavItemChild, (n) => n.navItem)
  navItemChilds: Array<NavItemChild>;

  @BeforeInsert()
  async generateId() {
    this.id = await uuidGenerate();
  }
}
