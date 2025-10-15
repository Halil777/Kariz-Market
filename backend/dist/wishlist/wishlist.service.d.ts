import { Repository } from 'typeorm';
import { WishlistItem } from './entities/wishlist.entity';
export declare class WishlistService {
    private readonly repo;
    constructor(repo: Repository<WishlistItem>);
    listForUser(userId: string): Promise<WishlistItem[]>;
    listForDevice(deviceId: string): Promise<WishlistItem[]>;
    toggleForUser(userId: string, productId: string): Promise<{
        removed: boolean;
        added?: undefined;
    } | {
        added: boolean;
        removed?: undefined;
    }>;
    toggleForDevice(deviceId: string, productId: string): Promise<{
        removed: boolean;
        added?: undefined;
    } | {
        added: boolean;
        removed?: undefined;
    }>;
    groupRegistered(): Promise<any>;
    groupGuests(): Promise<any>;
}
