import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
export declare class OrdersService {
    private readonly repo;
    constructor(repo: Repository<Order>);
    listForUser(userId: string): Promise<Order[]>;
    getForUser(userId: string, id: string): Promise<Order>;
}
