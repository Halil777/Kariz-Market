"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("./entities/cart.entity");
const cart_item_entity_1 = require("./entities/cart-item.entity");
let CartService = class CartService {
    constructor(cartRepo, itemRepo) {
        this.cartRepo = cartRepo;
        this.itemRepo = itemRepo;
    }
    async getOrCreateUserCart(userId) {
        let cart = await this.cartRepo.findOne({ where: { userId }, relations: ['items'] });
        if (!cart) {
            cart = this.cartRepo.create({ userId });
            await this.cartRepo.save(cart);
            cart.items = [];
        }
        return cart;
    }
    async getOrCreateDeviceCart(deviceId) {
        let cart = await this.cartRepo.findOne({ where: { deviceId }, relations: ['items'] });
        if (!cart) {
            cart = this.cartRepo.create({ deviceId });
            await this.cartRepo.save(cart);
            cart.items = [];
        }
        return cart;
    }
    async addItemByDevice(deviceId, productId, price, qty = 1) {
        const cart = await this.getOrCreateDeviceCart(deviceId);
        const item = this.itemRepo.create({ cartId: cart.id, variantId: productId, priceSnapshot: price, qty });
        await this.itemRepo.save(item);
        return this.getOrCreateDeviceCart(deviceId);
    }
    async removeItemByDevice(deviceId, itemId) {
        const cart = await this.getOrCreateDeviceCart(deviceId);
        await this.itemRepo.delete({ id: itemId, cartId: cart.id });
        return this.getOrCreateDeviceCart(deviceId);
    }
    async groupRegistered() {
        return this.itemRepo.query(`
      SELECT c.user_id as "userId", COALESCE(SUM(i.qty),0)::int as count
      FROM carts c
      LEFT JOIN cart_items i ON i.cart_id = c.id
      WHERE c.user_id IS NOT NULL
      GROUP BY c.user_id
      ORDER BY count DESC
    `);
    }
    async groupGuests() {
        return this.itemRepo.query(`
      SELECT c.device_id as "deviceId", COALESCE(SUM(i.qty),0)::int as count
      FROM carts c
      LEFT JOIN cart_items i ON i.cart_id = c.id
      WHERE c.device_id IS NOT NULL
      GROUP BY c.device_id
      ORDER BY count DESC
    `);
    }
    async addItem(userId, variantId, price, qty = 1) {
        const cart = await this.getOrCreateUserCart(userId);
        const item = this.itemRepo.create({ cartId: cart.id, variantId, priceSnapshot: price, qty });
        await this.itemRepo.save(item);
        return this.getOrCreateUserCart(userId);
    }
    async removeItem(userId, itemId) {
        const cart = await this.getOrCreateUserCart(userId);
        await this.itemRepo.delete({ id: itemId, cartId: cart.id });
        return this.getOrCreateUserCart(userId);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CartService);
//# sourceMappingURL=cart.service.js.map