import { Order } from './order.entity';
export declare class Payment {
    id: string;
    order: Order;
    orderId: string;
    provider: string;
    status: string;
    amount: string;
    currency: string;
    providerRef?: string | null;
    createdAt: Date;
}
