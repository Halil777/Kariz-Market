import { OrderItem } from './order-item.entity';
export declare class Order {
    id: string;
    userId: string;
    status: string;
    total: string;
    currency: string;
    items: OrderItem[];
    placedAt: Date;
}
