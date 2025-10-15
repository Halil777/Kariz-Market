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
exports.VendorsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vendor_entity_1 = require("./entities/vendor.entity");
const user_entity_1 = require("../users/entities/user.entity");
const bcrypt = require("bcrypt");
const role_enum_1 = require("../common/enums/role.enum");
function slugify(input) {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}
let VendorsService = class VendorsService {
    constructor(vendorRepo, userRepo) {
        this.vendorRepo = vendorRepo;
        this.userRepo = userRepo;
    }
    async create(dto) {
        const vendor = this.vendorRepo.create({
            name: dto.name,
            slug: slugify(dto.name),
            status: 'active',
            commissionType: 'percentage',
            commissionValue: '0',
            location: dto.location,
        });
        const savedVendor = await this.vendorRepo.save(vendor);
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({
            email: dto.email,
            phone: dto.phone?.trim() ? dto.phone.trim() : null,
            passwordHash,
            role: role_enum_1.Role.VendorUser,
            vendorId: savedVendor.id,
            displayName: dto.displayName?.trim() || dto.name,
            isActive: true,
        });
        await this.userRepo.save(user);
        return { vendorId: savedVendor.id };
    }
    async list() {
        const vendors = await this.vendorRepo.find({ order: { createdAt: 'DESC' } });
        const vendorIds = vendors.map(v => v.id);
        const users = vendorIds.length
            ? await this.userRepo
                .createQueryBuilder('u')
                .where('u.vendor_id IN (:...ids)', { ids: vendorIds })
                .getMany()
            : [];
        const map = new Map(users.map(u => [u.vendorId, u]));
        return vendors.map(v => ({
            id: v.id,
            name: v.name,
            slug: v.slug,
            status: v.status,
            location: v.location,
            createdAt: v.createdAt,
            email: map.get(v.id)?.email || null,
            phone: map.get(v.id)?.phone || null,
        }));
    }
    async getMe(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user || !user.vendorId)
            return null;
        const vendor = await this.vendorRepo.findOne({ where: { id: user.vendorId } });
        return vendor || null;
    }
    async update(id, dto) {
        const patch = {};
        if (dto.name) {
            patch.name = dto.name;
            patch.slug = slugify(dto.name);
        }
        if (dto.status)
            patch.status = dto.status;
        if (dto.location)
            patch.location = dto.location;
        await this.vendorRepo.update({ id }, patch);
        return this.vendorRepo.findOne({ where: { id } });
    }
    async remove(id) {
        await this.vendorRepo.delete({ id });
        return { success: true };
    }
};
exports.VendorsService = VendorsService;
exports.VendorsService = VendorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vendor_entity_1.Vendor)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VendorsService);
//# sourceMappingURL=vendors.service.js.map