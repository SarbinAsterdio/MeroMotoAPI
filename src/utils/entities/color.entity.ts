import slugify from 'slugify';
import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { uuidGenerate } from '../helpers';
import { AvailableColor } from './available-color.entity';

@Entity()
export class Colors {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  hexCode: string;

  @OneToMany(() => AvailableColor, (av) => av.color)
  availableColor: Array<AvailableColor>;

  @Column()
  slug: string;

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
    this.updateSlugFromName();
  }

  updateSlugFromName(): void {
    this.slug = slugify(this.name).toLowerCase().trim();
  }

  @BeforeInsert()
  async generateId(): Promise<void> {
    this.id = await uuidGenerate();
  }
}
