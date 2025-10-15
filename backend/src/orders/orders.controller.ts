import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  list(@Req() req: any) {
    return this.orders.listForUser(req.user.id);
  }

  @Post()
  create(@Req() req: any, @Body() body: CreateOrderDto) {
    return this.orders.placeOrder(req.user.id, body);
  }

  @Post(':id/cancel')
  cancel(@Req() req: any, @Param('id') id: string, @Body() body: CancelOrderDto) {
    return this.orders.cancelOrder(req.user.id, id, body.reason);
  }

  @Get('admin')
  listAdmin(
    @Query('status') status?: string,
    @Query('q') query?: string,
    @Query('vendorId') vendorId?: string,
  ) {
    return this.orders.listForAdmin({ status, query, vendorId });
  }

  @Get('admin/:id')
  getAdmin(@Param('id') id: string) {
    return this.orders.getForAdmin(id);
  }

  @Get('vendor')
  listVendor(@Req() req: any, @Query('status') status?: string) {
    return this.orders.listForVendor(req.user.vendorId ?? null, { status });
  }

  @Get('vendor/:id')
  getVendor(@Req() req: any, @Param('id') id: string) {
    return this.orders.getForVendor(req.user.vendorId ?? null, id);
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.orders.getForUser(req.user.id, id);
  }
}

