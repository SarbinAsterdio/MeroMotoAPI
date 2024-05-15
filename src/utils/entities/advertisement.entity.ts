import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { uuidGenerate } from '../helpers';
import { AdColumnType, PageName } from '../common/common.enum';

@Entity()
export class Advertisement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, default: 'abc' })
  webImage: string;

  @Column({ nullable: false, default: 'abc' })
  mobileImage: string;

  @Column({ nullable: false, default: 4 })
  position: number;

  @Column({
    type: 'enum',
    nullable: false,
    enum: AdColumnType,
    default: AdColumnType.COLUMN_1,
  })
  column: AdColumnType;

  @Column({ type: 'enum', enum: PageName, default: PageName.HOME })
  pageName: PageName;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: false, default: false })
  status: boolean;

  @Column({ nullable: false, default: false })
  default: boolean;

  @Column({ type: 'timestamp', nullable: true })
  startDateAndTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDateAndTime: Date;

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
