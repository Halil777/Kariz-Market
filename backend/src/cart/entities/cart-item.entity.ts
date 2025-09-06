import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @Index()
  @Column({ name: 'cart_id' })
  cartId: string;

  @Column({ name: 'variant_id' })
  variantId: string;

  @Column({ type: 'int', default: 1 })
  qty: number;

  @Column({ name: 'price_snapshot', type: 'numeric', precision: 10, scale: 2 })
  priceSnapshot: string;
}

