import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('wishlists')
@Index(['userId', 'productId'], { unique: true, where: 'user_id IS NOT NULL' })
@Index(['deviceId', 'productId'], { unique: true, where: 'device_id IS NOT NULL' })
export class WishlistItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId?: string | null;

  @Column({ name: 'device_id', nullable: true })
  deviceId?: string | null;

  @Column({ name: 'product_id' })
  productId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

