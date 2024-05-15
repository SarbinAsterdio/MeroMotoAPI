import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import slugify from 'slugify';
import { uuidGenerate } from '../helpers';
import { PageName, DynamicContentType } from '../common/common.enum';

@Entity()
export class DynamicContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({
    type: 'enum',
    enum: DynamicContentType,
    default: DynamicContentType.SEO,
  })
  type: DynamicContentType;

  @Column({ nullable: false })
  slug: string;

  @Column({ nullable: false })
  description: string;

  @Column({ type: 'enum', enum: PageName, default: PageName.HOME })
  pageName: PageName;

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
  async updateSlugFromDescription(): Promise<void> {
    const newtitle = this.title.toLowerCase();
    this.slug = slugify(`${newtitle}`);
  }
  @BeforeInsert()
  async generateId() {
    this.id = await uuidGenerate();
  }
}
