import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export type CouponType = 'percent' | 'fixed';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ length: 64 })
  code: string;

  @Column({ type: 'varchar', length: 16, default: 'percent' })
  type: CouponType;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  value: string; // percent or fixed amount

  @Column({ name: 'starts_at', type: 'date', nullable: true })
  startsAt?: string | null;

  @Column({ name: 'ends_at', type: 'date', nullable: true })
  endsAt?: string | null;

  @Column({ name: 'usage_count', type: 'int', default: 0 })
  usageCount: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'name_tk', nullable: true })
  nameTk?: string | null;

  @Column({ name: 'name_ru', nullable: true })
  nameRu?: string | null;

  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

