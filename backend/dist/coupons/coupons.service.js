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
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const coupon_entity_1 = require("./entities/coupon.entity");
let CouponsService = class CouponsService {
    constructor(repo) {
        this.repo = repo;
    }
    list() {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }
    async create(dto) {
        const entity = this.repo.create({
            code: dto.code,
            type: dto.type,
            value: String(dto.value),
            startsAt: dto.startsAt || null,
            endsAt: dto.endsAt || null,
            isActive: dto.isActive ?? true,
            nameTk: dto.nameTk || null,
            nameRu: dto.nameRu || null,
            imageUrl: dto.imageUrl || null,
        });
        return this.repo.save(entity);
    }
    async update(id, dto) {
        const patch = {};
        if (dto.code !== undefined)
            patch.code = dto.code;
        if (dto.type !== undefined)
            patch.type = dto.type;
        if (dto.value !== undefined)
            patch.value = String(dto.value);
        if (dto.startsAt !== undefined)
            patch.startsAt = dto.startsAt;
        if (dto.endsAt !== undefined)
            patch.endsAt = dto.endsAt;
        if (dto.isActive !== undefined)
            patch.isActive = dto.isActive;
        if (dto.nameTk !== undefined)
            patch.nameTk = dto.nameTk;
        if (dto.nameRu !== undefined)
            patch.nameRu = dto.nameRu;
        if (dto.imageUrl !== undefined)
            patch.imageUrl = dto.imageUrl;
        await this.repo.update({ id }, patch);
        return this.repo.findOne({ where: { id } });
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(coupon_entity_1.Coupon)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map