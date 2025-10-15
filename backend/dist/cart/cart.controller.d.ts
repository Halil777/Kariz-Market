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
    getPublic(body: {
        deviceId: string;
    }): Promise<import("./entities/cart.entity").Cart>;
    addPublic(body: {
        deviceId: string;
        productId: string;
        price: string;
        qty?: number;
    }): Promise<import("./entities/cart.entity").Cart>;
    removePublic(body: {
        deviceId: string;
        itemId: string;
    }): Promise<import("./entities/cart.entity").Cart>;
    groupRegistered(): Promise<any>;
    groupGuests(): Promise<any>;
}
