import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_translations')
export class ProductTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Index()
  @Column({ name: 'product_id' })
  productId: string;

  @Index()
  @Column({ length: 8 })
  locale: string; // e.g., en, ru, tk

  @Column({ length: 512 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;
}

