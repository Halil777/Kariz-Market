import { Cart } from './cart.entity';
export declare class CartItem {
    id: string;
    cart: Cart;
    cartId: string;
    variantId: string;
    qty: number;
    priceSnapshot: string;
}
