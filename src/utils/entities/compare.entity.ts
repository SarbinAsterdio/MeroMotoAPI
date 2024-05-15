import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Variant } from '.';
import { uuidGenerate } from '../helpers';
import { CompareType } from '../common/common.enum';

@Entity()
export class Compare {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  featured: boolean;

  //type to determine if comparision is from user or admin
  @Column({ type: 'enum', enum: CompareType, default: CompareType.USER })
  type: CompareType;

  // @OneToOne(() => Variant)
  // @JoinColumn()
  // variant1: Variant;

  // @OneToOne(() => Variant)
  // @JoinColumn()
  // variant2: Variant;

  // @OneToOne(() => Variant)
  // @JoinColumn()
  // variant3: Variant;

  // @OneToOne(() => Variant)
  // @JoinColumn()
  // variant4: Variant;

  @ManyToMany(() => Variant)
  @JoinTable()
  variants: Variant[];

  @Column({ default: 1 })
  viewCount: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeInsert()
  async genereateId() {
    this.id = await uuidGenerate();
  }
}
