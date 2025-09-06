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

  @ManyToOne(() => Vendor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @Index()
  @Column({ name: 'vendor_id' })
  vendorId: string;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category?: Category | null;

  @Index()
  @Column({ name: 'category_id', nullable: true })
  categoryId?: string | null;

  @Index({ unique: true })
  @Column()
  sku: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ name: 'tax_class', nullable: true })
  taxClass?: string | null;

  @Column({ nullable: true })
  brand?: string | null;

  @OneToMany(() => ProductTranslation, (t) => t.product)
  translations: ProductTranslation[];

  @OneToMany(() => ProductVariant, (v) => v.product)
  variants: ProductVariant[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

