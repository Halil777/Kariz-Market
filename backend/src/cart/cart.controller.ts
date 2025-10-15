import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  get(@Req() req: any) {
    return this.cart.getOrCreateUserCart(req.user.id);
  }

  @Post('items')
  add(@Req() req: any, @Body() body: { variantId: string; price: string; qty?: number }) {
    return this.cart.addItem(req.user.id, body.variantId, body.price, body.qty ?? 1);
  }

  @Delete('items/:id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.cart.removeItem(req.user.id, id);
  }

  // Public cart for anonymous device
  @Post('public/get')
  getPublic(@Body() body: { deviceId: string }) {
    return this.cart.getOrCreateDeviceCart(body.deviceId);
  }

  @Post('public/items')
  addPublic(@Body() body: { deviceId: string; productId: string; price: string; qty?: number }) {
    return this.cart.addItemByDevice(body.deviceId, body.productId, body.price, body.qty ?? 1);
  }

  @Post('public/items/remove')
  removePublic(@Body() body: { deviceId: string; itemId: string }) {
    return this.cart.removeItemByDevice(body.deviceId, body.itemId);
  }

  // Admin aggregates
  @UseGuards(JwtAuthGuard)
  @Get('admin/registered')
  groupRegistered() { return this.cart.groupRegistered() }

  @UseGuards(JwtAuthGuard)
  @Get('admin/guests')
  groupGuests() { return this.cart.groupGuests() }
}

