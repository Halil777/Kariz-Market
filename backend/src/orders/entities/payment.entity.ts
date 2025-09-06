import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Index()
  @Column({ name: 'order_id' })
  orderId: string;

  @Column()
  provider: string; // stripe, paypal, local

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ name: 'provider_ref', nullable: true })
  providerRef?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

