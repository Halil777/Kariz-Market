import { CartItem } from './cart-item.entity';
export declare class Cart {
    id: string;
    userId?: string | null;
    deviceId?: string | null;
    items: CartItem[];
    updatedAt: Date;
    createdAt: Date;
}
