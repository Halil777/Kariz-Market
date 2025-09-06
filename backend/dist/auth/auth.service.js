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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const refresh_token_entity_1 = require("./entities/refresh-token.entity");
const role_enum_1 = require("../common/enums/role.enum");
let AuthService = class AuthService {
    constructor(users, jwt, refreshRepo) {
        this.users = users;
        this.jwt = jwt;
        this.refreshRepo = refreshRepo;
    }
    async validateUser(email, password) {
        const user = await this.users.findByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return user;
    }
    signAccessToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return this.jwt.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret',
            expiresIn: process.env.JWT_ACCESS_TTL || '15m',
        });
    }
    signRefreshToken(user) {
        const payload = { sub: user.id, type: 'refresh' };
        return this.jwt.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
            expiresIn: process.env.JWT_REFRESH_TTL || '7d',
        });
    }
    async issueTokens(user) {
        const accessToken = this.signAccessToken(user);
        const refreshToken = this.signRefreshToken(user);
        const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
        const tokenHash = await bcrypt.hash(refreshToken, 10);
        const entity = this.refreshRepo.create({
            userId: user.id,
            tokenHash,
            expiresAt,
        });
        await this.refreshRepo.save(entity);
        return { accessToken, refreshToken };
    }
    async register(email, password) {
        const hash = await bcrypt.hash(password, 10);
        const user = await this.users.create({ email, passwordHash: hash, role: role_enum_1.Role.Customer });
        return this.issueTokens(user);
    }
    async login(email, password) {
        const user = await this.validateUser(email, password);
        return this.issueTokens(user);
    }
    async refresh(userId, token) {
        try {
            this.jwt.verify(token, { secret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret' });
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const records = await this.refreshRepo.find({ where: { userId } });
        let match = null;
        for (const r of records) {
            if (await bcrypt.compare(token, r.tokenHash)) {
                match = r;
                break;
            }
        }
        if (!match)
            throw new common_1.UnauthorizedException('Refresh token not recognized');
        await this.refreshRepo.remove(match);
        const user = (await this.users.findById(userId));
        return this.issueTokens(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map