import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total: string;

  @Column({ default: 'USD' })
  currency: string;

  @OneToMany(() => OrderItem, (i) => i.order)
  items: OrderItem[];

  @CreateDateColumn({ name: 'placed_at' })
  placedAt: Date;
}

