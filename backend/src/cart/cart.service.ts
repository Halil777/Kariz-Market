import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private readonly itemRepo: Repository<CartItem>,
  ) {}

  async getOrCreateUserCart(userId: string) {
    let cart = await this.cartRepo.findOne({ where: { userId }, relations: ['items'] });
    if (!cart) {
      cart = this.cartRepo.create({ userId });
      await this.cartRepo.save(cart);
      cart.items = [];
    }
    return cart;
  }

  async addItem(userId: string, variantId: string, price: string, qty = 1) {
    const cart = await this.getOrCreateUserCart(userId);
    const item = this.itemRepo.create({ cartId: cart.id, variantId, priceSnapshot: price, qty });
    await this.itemRepo.save(item);
    return this.getOrCreateUserCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getOrCreateUserCart(userId);
    await this.itemRepo.delete({ id: itemId, cartId: cart.id });
    return this.getOrCreateUserCart(userId);
  }
}

