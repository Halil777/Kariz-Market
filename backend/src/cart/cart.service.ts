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

  async getOrCreateDeviceCart(deviceId: string) {
    let cart = await this.cartRepo.findOne({ where: { deviceId }, relations: ['items'] });
    if (!cart) {
      cart = this.cartRepo.create({ deviceId });
      await this.cartRepo.save(cart);
      cart.items = [];
    }
    return cart;
  }

  async addItemByDevice(deviceId: string, productId: string, price: string, qty = 1) {
    const cart = await this.getOrCreateDeviceCart(deviceId);
    const item = this.itemRepo.create({ cartId: cart.id, variantId: productId, priceSnapshot: price, qty });
    await this.itemRepo.save(item);
    return this.getOrCreateDeviceCart(deviceId);
  }

  async removeItemByDevice(deviceId: string, itemId: string) {
    const cart = await this.getOrCreateDeviceCart(deviceId);
    await this.itemRepo.delete({ id: itemId, cartId: cart.id });
    return this.getOrCreateDeviceCart(deviceId);
  }

  // Admin aggregates
  async groupRegistered() {
    return this.itemRepo.query(`
      SELECT c.user_id as "userId", COALESCE(SUM(i.qty),0)::int as count
      FROM carts c
      LEFT JOIN cart_items i ON i.cart_id = c.id
      WHERE c.user_id IS NOT NULL
      GROUP BY c.user_id
      ORDER BY count DESC
    `)
  }

  async groupGuests() {
    return this.itemRepo.query(`
      SELECT c.device_id as "deviceId", COALESCE(SUM(i.qty),0)::int as count
      FROM carts c
      LEFT JOIN cart_items i ON i.cart_id = c.id
      WHERE c.device_id IS NOT NULL
      GROUP BY c.device_id
      ORDER BY count DESC
    `)
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

