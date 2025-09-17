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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banner = void 0;
const typeorm_1 = require("typeorm");
let Banner = class Banner {
};
exports.Banner = Banner;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Banner.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url' }),
    __metadata("design:type", String)
], Banner.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'title_tm', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Banner.prototype, "titleTm", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'title_ru', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Banner.prototype, "titleRu", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subtitle_tm', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Banner.prototype, "subtitleTm", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subtitle_ru', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Banner.prototype, "subtitleRu", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Banner.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Banner.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Banner.prototype, "createdAt", void 0);
exports.Banner = Banner = __decorate([
    (0, typeorm_1.Entity)('banners')
], Banner);
//# sourceMappingURL=banner.entity.js.map