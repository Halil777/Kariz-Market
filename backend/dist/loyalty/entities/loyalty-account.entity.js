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
exports.LoyaltyAccount = void 0;
const typeorm_1 = require("typeorm");
const loyalty_transaction_entity_1 = require("./loyalty-transaction.entity");
let LoyaltyAccount = class LoyaltyAccount {
};
exports.LoyaltyAccount = LoyaltyAccount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LoyaltyAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', unique: true }),
    __metadata("design:type", String)
], LoyaltyAccount.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'points_balance', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], LoyaltyAccount.prototype, "pointsBalance", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => loyalty_transaction_entity_1.LoyaltyTransaction, (t) => t.account),
    __metadata("design:type", Array)
], LoyaltyAccount.prototype, "transactions", void 0);
exports.LoyaltyAccount = LoyaltyAccount = __decorate([
    (0, typeorm_1.Entity)('loyalty_accounts')
], LoyaltyAccount);
//# sourceMappingURL=loyalty-account.entity.js.map