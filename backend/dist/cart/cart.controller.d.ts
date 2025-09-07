import { CartService } from './cart.service';
export declare class CartController {
    private readonly cart;
    constructor(cart: CartService);
    get(req: any): Promise<import("./entities/cart.entity").Cart>;
    add(req: any, body: {
        variantId: string;
        price: string;
        qty?: number;
    }): Promise<import("./entities/cart.entity").Cart>;
    remove(req: any, id: string): Promise<import("./entities/cart.entity").Cart>;
}
