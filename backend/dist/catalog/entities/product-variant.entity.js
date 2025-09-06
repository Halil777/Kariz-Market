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
exports.ProductVariant = void 0;
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
let ProductVariant = class ProductVariant {
};
exports.ProductVariant = ProductVariant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductVariant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], ProductVariant.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], ProductVariant.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductVariant.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", String)
], ProductVariant.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'compare_at', type: 'numeric', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "compareAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "attributes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "barcode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_on_hand', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "stockOnHand", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_reserved', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "stockReserved", void 0);
exports.ProductVariant = ProductVariant = __decorate([
    (0, typeorm_1.Entity)('product_variants')
], ProductVariant);
//# sourceMappingURL=product-variant.entity.js.map