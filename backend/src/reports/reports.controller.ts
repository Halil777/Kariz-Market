import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/enums/role.enum';

function parseDate(s?: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

@Controller('reports')
export class ReportsController {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  @Get('overview')
  async overview(@Query('from') from?: string, @Query('to') to?: string) {
    const toDate = parseDate(to) || new Date();
    const fromDate = parseDate(from) || new Date(toDate.getTime() - 29 * 24 * 60 * 60 * 1000);

    // sales by day
    const rows = await this.orders
      .createQueryBuilder('o')
      .select("date_trunc('day', o.placed_at)", 'day')
      .addSelect('SUM(o.total::numeric)', 'revenue')
      .addSelect('COUNT(*)', 'orders')
      .where('o.placed_at BETWEEN :from AND :to', { from: fromDate, to: toDate })
      .groupBy("date_trunc('day', o.placed_at)")
      .orderBy('day', 'ASC')
      .getRawMany();

    const salesByDay = rows.map((r) => ({
      date: new Date(r.day).toISOString().slice(0, 10),
      revenue: Number(r.revenue || 0),
      orders: Number(r.orders || 0),
    }));

    const totalRevenue = salesByDay.reduce((a, b) => a + b.revenue, 0);
    const totalOrders = salesByDay.reduce((a, b) => a + b.orders, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const newCustomers = await this.users.count({
      where: {
        role: Role.Customer,
        createdAt: (fromDate && toDate) as any, // narrowed below via query builder
      } as any,
    });
    // precise count via qb to avoid typeorm date range quirks with between
    const newCustomersCount = await this.users
      .createQueryBuilder('u')
      .where('u.role = :role', { role: Role.Customer })
      .andWhere('u.created_at BETWEEN :from AND :to', { from: fromDate, to: toDate })
      .getCount();

    return {
      range: { from: fromDate.toISOString(), to: toDate.toISOString() },
      totals: {
        revenue: totalRevenue,
        orders: totalOrders,
        avgOrderValue,
        newCustomers: newCustomersCount,
      },
      salesByDay,
    };
  }
}

