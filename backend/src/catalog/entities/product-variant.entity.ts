import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Index()
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Index({ unique: true })
  @Column()
  sku: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: string;

  @Column({ name: 'compare_at', type: 'numeric', precision: 10, scale: 2, nullable: true })
  compareAt?: string | null;

  @Column({ type: 'jsonb', default: {} })
  attributes: Record<string, any>;

  @Column({ nullable: true })
  barcode?: string | null;

  @Column({ name: 'stock_on_hand', type: 'int', default: 0 })
  stockOnHand: number;

  @Column({ name: 'stock_reserved', type: 'int', default: 0 })
  stockReserved: number;
}

