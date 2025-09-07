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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../orders/entities/order.entity");
const user_entity_1 = require("../users/entities/user.entity");
const role_enum_1 = require("../common/enums/role.enum");
function parseDate(s) {
    if (!s)
        return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
}
let ReportsController = class ReportsController {
    constructor(orders, users) {
        this.orders = orders;
        this.users = users;
    }
    async overview(from, to) {
        const toDate = parseDate(to) || new Date();
        const fromDate = parseDate(from) || new Date(toDate.getTime() - 29 * 24 * 60 * 60 * 1000);
        const rows = await this.orders
            .createQueryBuilder('o')
            .select("date_trunc('day', o.placed_at)", 'day')
            .addSelect('SUM(o.total::numeric)', 'revenue')
            .addSelect('COUNT(*)', 'orders')
            .where('o.placed_at BETWEEN :from AND :to', { from: fromDate, to: toDate })
            .groupBy("date_trunc('day', o.placed_at)")
            .orderBy('day', 'ASC')
            .getRawMany();
        const salesByDay = rows.map((r) => ({
            date: new Date(r.day).toISOString().slice(0, 10),
            revenue: Number(r.revenue || 0),
            orders: Number(r.orders || 0),
        }));
        const totalRevenue = salesByDay.reduce((a, b) => a + b.revenue, 0);
        const totalOrders = salesByDay.reduce((a, b) => a + b.orders, 0);
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const newCustomers = await this.users.count({
            where: {
                role: role_enum_1.Role.Customer,
                createdAt: (fromDate && toDate),
            },
        });
        const newCustomersCount = await this.users
            .createQueryBuilder('u')
            .where('u.role = :role', { role: role_enum_1.Role.Customer })
            .andWhere('u.created_at BETWEEN :from AND :to', { from: fromDate, to: toDate })
            .getCount();
        return {
            range: { from: fromDate.toISOString(), to: toDate.toISOString() },
            totals: {
                revenue: totalRevenue,
                orders: totalOrders,
                avgOrderValue,
                newCustomers: newCustomersCount,
            },
            salesByDay,
        };
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "overview", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map