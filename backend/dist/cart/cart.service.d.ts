import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
export declare class CartService {
    private readonly cartRepo;
    private readonly itemRepo;
    constructor(cartRepo: Repository<Cart>, itemRepo: Repository<CartItem>);
    getOrCreateUserCart(userId: string): Promise<Cart>;
    addItem(userId: string, variantId: string, price: string, qty?: number): Promise<Cart>;
    removeItem(userId: string, itemId: string): Promise<Cart>;
}
