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
exports.LoyaltyTransaction = void 0;
const typeorm_1 = require("typeorm");
const loyalty_account_entity_1 = require("./loyalty-account.entity");
let LoyaltyTransaction = class LoyaltyTransaction {
};
exports.LoyaltyTransaction = LoyaltyTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LoyaltyTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => loyalty_account_entity_1.LoyaltyAccount, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'account_id' }),
    __metadata("design:type", loyalty_account_entity_1.LoyaltyAccount)
], LoyaltyTransaction.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'account_id' }),
    __metadata("design:type", String)
], LoyaltyTransaction.prototype, "accountId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LoyaltyTransaction.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], LoyaltyTransaction.prototype, "points", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ref_type', nullable: true }),
    __metadata("design:type", String)
], LoyaltyTransaction.prototype, "refType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ref_id', nullable: true }),
    __metadata("design:type", String)
], LoyaltyTransaction.prototype, "refId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'ts' }),
    __metadata("design:type", Date)
], LoyaltyTransaction.prototype, "ts", void 0);
exports.LoyaltyTransaction = LoyaltyTransaction = __decorate([
    (0, typeorm_1.Entity)('loyalty_transactions')
], LoyaltyTransaction);
//# sourceMappingURL=loyalty-transaction.entity.js.map