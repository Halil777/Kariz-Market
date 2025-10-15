import { Controller, Get, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { OrdersService } from '../orders/orders.service';
import { LoyaltyService } from '../loyalty/loyalty.service';

@UseGuards(JwtAuthGuard)
@Controller('account')
export class AccountController {
  constructor(
    private readonly users: UsersService,
    private readonly orders: OrdersService,
    private readonly loyalty: LoyaltyService,
  ) {}

  @Get('overview')
  async overview(@Req() req: any) {
    const user = await this.users.findById(req.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [summary, recentOrders, loyalty] = await Promise.all([
      this.orders.getUserSummary(user.id),
      this.orders.listRecentForUser(user.id, 5),
      this.loyalty.getOrCreate(user.id),
    ]);

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName ?? null,
        phone: user.phone ?? null,
        createdAt: user.createdAt.toISOString(),
      },
      stats: {
        totalOrders: summary.totalOrders,
        openOrders: summary.openOrders,
        totalSpent: summary.totalSpent,
        loyaltyPoints: loyalty.pointsBalance,
        lastOrderAt: summary.lastOrderAt,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        status: order.status,
        total: order.total,
        currency: order.currency,
        placedAt: order.placedAt,
        itemCount: order.itemCount,
        vendors: order.vendors,
      })),
    };
  }
}
