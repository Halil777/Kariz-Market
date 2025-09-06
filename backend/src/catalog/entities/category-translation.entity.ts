import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('category_translations')
export class CategoryTranslation {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Index()
  @Column({ name: 'category_id' })
  categoryId: string;

  @Index()
  @Column({ length: 8 })
  locale: string; // 'tk' | 'ru'

  @Column({ length: 512 })
  name: string;
}

