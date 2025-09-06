import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly orders;
    constructor(orders: OrdersService);
    list(req: any): Promise<import("./entities/order.entity").Order[]>;
    get(req: any, id: string): Promise<import("./entities/order.entity").Order>;
}
