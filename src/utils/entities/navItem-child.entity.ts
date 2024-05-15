import { Min } from 'class-validator';
import {
  Entity,
  Column,
  ManyToOne,
  BeforeInsert,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { uuidGenerate } from '../helpers';
import { NavItem } from './navItem.entity';
import { NavItemChildType } from '../common/common.enum';

@Entity()
export class NavItemChild {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  link: string;

  @Column({ default: false })
  featured: boolean;

  @Column({ nullable: true, default: null })
  @Min(1, { message: 'Position cannot be less than 1' })
  position: number;

  @Column({
    type: 'enum',
    enum: NavItemChildType,
    default: NavItemChildType.NORMAL,
  })
  type: NavItemChildType;

  data?: Array<any>;

  @ManyToOne(() => NavItem, (n) => n.navItemChilds)
  navItem: NavItem;

  @BeforeInsert()
  async generateId() {
    this.id = await uuidGenerate();
  }
}
