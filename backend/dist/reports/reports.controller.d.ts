import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
export declare class ReportsController {
    private readonly orders;
    private readonly users;
    constructor(orders: Repository<Order>, users: Repository<User>);
    overview(from?: string, to?: string): Promise<{
        range: {
            from: string;
            to: string;
        };
        totals: {
            revenue: number;
            orders: number;
            avgOrderValue: number;
            newCustomers: number;
        };
        salesByDay: {
            date: string;
            revenue: number;
            orders: number;
        }[];
    }>;
}
