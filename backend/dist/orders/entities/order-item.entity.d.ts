import { Order } from './order.entity';
export declare class OrderItem {
    id: string;
    order: Order;
    orderId: string;
    vendorId?: string | null;
    variantId: string;
    qty: number;
    unitPrice: string;
    subtotal: string;
}
