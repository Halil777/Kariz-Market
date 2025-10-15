import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
export declare class CartService {
    private readonly cartRepo;
    private readonly itemRepo;
    constructor(cartRepo: Repository<Cart>, itemRepo: Repository<CartItem>);
    getOrCreateUserCart(userId: string): Promise<Cart>;
    getOrCreateDeviceCart(deviceId: string): Promise<Cart>;
    addItemByDevice(deviceId: string, productId: string, price: string, qty?: number): Promise<Cart>;
    removeItemByDevice(deviceId: string, itemId: string): Promise<Cart>;
    groupRegistered(): Promise<any>;
    groupGuests(): Promise<any>;
    addItem(userId: string, variantId: string, price: string, qty?: number): Promise<Cart>;
    removeItem(userId: string, itemId: string): Promise<Cart>;
}
