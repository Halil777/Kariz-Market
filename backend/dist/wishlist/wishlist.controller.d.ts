import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private readonly wishlist;
    constructor(wishlist: WishlistService);
    list(req: any): Promise<import("./entities/wishlist.entity").WishlistItem[]>;
    toggle(req: any, body: {
        productId: string;
    }): Promise<{
        removed: boolean;
        added?: undefined;
    } | {
        added: boolean;
        removed?: undefined;
    }>;
    listPublic(body: {
        deviceId: string;
    }): Promise<import("./entities/wishlist.entity").WishlistItem[]>;
    togglePublic(body: {
        deviceId: string;
        productId: string;
    }): Promise<{
        removed: boolean;
        added?: undefined;
    } | {
        added: boolean;
        removed?: undefined;
    }>;
    registered(): Promise<any>;
    guests(): Promise<any>;
}
