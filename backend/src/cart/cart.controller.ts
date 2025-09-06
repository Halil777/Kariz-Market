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
}

