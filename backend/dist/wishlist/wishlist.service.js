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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wishlist_entity_1 = require("./entities/wishlist.entity");
let WishlistService = class WishlistService {
    constructor(repo) {
        this.repo = repo;
    }
    listForUser(userId) {
        return this.repo.find({ where: { userId } });
    }
    listForDevice(deviceId) {
        return this.repo.find({ where: { deviceId } });
    }
    async toggleForUser(userId, productId) {
        const existing = await this.repo.findOne({ where: { userId, productId } });
        if (existing) {
            await this.repo.delete({ id: existing.id });
            return { removed: true };
        }
        const created = this.repo.create({ userId, productId });
        await this.repo.save(created);
        return { added: true };
    }
    async toggleForDevice(deviceId, productId) {
        const existing = await this.repo.findOne({ where: { deviceId, productId } });
        if (existing) {
            await this.repo.delete({ id: existing.id });
            return { removed: true };
        }
        const created = this.repo.create({ deviceId, productId });
        await this.repo.save(created);
        return { added: true };
    }
    async groupRegistered() {
        return this.repo.query(`
      SELECT user_id as "userId", COUNT(*)::int as count
      FROM wishlists
      WHERE user_id IS NOT NULL
      GROUP BY user_id
      ORDER BY count DESC
    `);
    }
    async groupGuests() {
        return this.repo.query(`
      SELECT device_id as "deviceId", COUNT(*)::int as count
      FROM wishlists
      WHERE device_id IS NOT NULL
      GROUP BY device_id
      ORDER BY count DESC
    `);
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wishlist_entity_1.WishlistItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map