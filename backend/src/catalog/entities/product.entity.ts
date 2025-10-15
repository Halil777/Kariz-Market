import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { Category } from './category.entity';
import { ProductTranslation } from './product-translation.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vendor, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor?: Vendor | null;

  @Index()
  @Column({ name: 'vendor_id', type: 'uuid', nullable: true })
  vendorId?: string | null;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category?: Category | null;

  @Index()
  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId?: string | null;

  @Index({ unique: true })
  @Column()
  sku: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'jsonb', default: [] })
  images: string[];

  @Column({ type: 'varchar', length: 16, default: 'count' })
  unit: string; // 'kg' | 'l' | 'count'

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  price: string; // base price

  @Column({ name: 'compare_at', type: 'numeric', precision: 10, scale: 2, nullable: true })
  compareAt?: string | null; // old price

  @Column({ name: 'discount_pct', type: 'numeric', precision: 5, scale: 2, default: 0 })
  discountPct: string; // percentage 0..100

  @Column({ name: 'stock', type: 'int', default: 0 })
  stock: number;

  @Column({ name: 'tax_class', nullable: true })
  taxClass?: string | null;

  @Column({ nullable: true })
  brand?: string | null;

  @Column({ type: 'jsonb', default: [] })
  specs: Array<{
    titleTk?: string | null;
    titleRu?: string | null;
    textTk?: string | null;
    textRu?: string | null;
  }>;

  @OneToMany(() => ProductTranslation, (t) => t.product)
  translations: ProductTranslation[];

  @OneToMany(() => ProductVariant, (v) => v.product)
  variants: ProductVariant[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

