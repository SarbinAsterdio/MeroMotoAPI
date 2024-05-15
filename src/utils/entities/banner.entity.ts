import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { uuidGenerate } from '../helpers';
import { PageName } from '../common/common.enum';

@Entity()
export class Banner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  webImage: string;

  @Column({ nullable: true })
  tabImage: string;

  @Column({ nullable: true })
  mobileImage: string;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'enum', enum: PageName, default: PageName.HOME })
  pageName: PageName;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true, default: null })
  buttonText: string;

  @Column({ nullable: false })
  section: string;

  @Column({ nullable: true })
  hexCode: string;

  @Column({ nullable: false, default: false })
  customizable: boolean;

  @Column({ nullable: false, default: false })
  status: boolean;

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
