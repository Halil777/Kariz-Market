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
var SeedAdminProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedAdminProvider = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const role_enum_1 = require("../common/enums/role.enum");
const bcrypt = require("bcrypt");
let SeedAdminProvider = SeedAdminProvider_1 = class SeedAdminProvider {
    constructor(users) {
        this.users = users;
        this.logger = new common_1.Logger(SeedAdminProvider_1.name);
    }
    async onApplicationBootstrap() {
        const email = process.env.SEED_ADMIN_EMAIL || 'kariz@gmail.com';
        const password = process.env.SEED_ADMIN_PASSWORD || '12345!';
        try {
            const existing = await this.users.findByEmail(email);
            if (existing) {
                this.logger.log(`Admin user exists: ${email}`);
                return;
            }
            const hash = await bcrypt.hash(password, 10);
            await this.users.create({
                email,
                passwordHash: hash,
                role: role_enum_1.Role.SuperAdmin,
                isActive: true,
            });
            this.logger.log(`Seeded SuperAdmin user: ${email}`);
        }
        catch (e) {
            this.logger.error('Failed seeding admin user', e);
        }
    }
};
exports.SeedAdminProvider = SeedAdminProvider;
exports.SeedAdminProvider = SeedAdminProvider = SeedAdminProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], SeedAdminProvider);
//# sourceMappingURL=seed-admin.provider.js.map