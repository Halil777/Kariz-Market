"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const vendors_module_1 = require("./vendors/vendors.module");
const catalog_module_1 = require("./catalog/catalog.module");
const throttler_1 = require("@nestjs/throttler");
const cart_module_1 = require("./cart/cart.module");
const orders_module_1 = require("./orders/orders.module");
const loyalty_module_1 = require("./loyalty/loyalty.module");
const events_module_1 = require("./events/events.module");
const user_entity_1 = require("./users/entities/user.entity");
const vendor_entity_1 = require("./vendors/entities/vendor.entity");
const category_entity_1 = require("./catalog/entities/category.entity");
const product_entity_1 = require("./catalog/entities/product.entity");
const product_translation_entity_1 = require("./catalog/entities/product-translation.entity");
const product_variant_entity_1 = require("./catalog/entities/product-variant.entity");
const category_translation_entity_1 = require("./catalog/entities/category-translation.entity");
const cart_entity_1 = require("./cart/entities/cart.entity");
const cart_item_entity_1 = require("./cart/entities/cart-item.entity");
const order_entity_1 = require("./orders/entities/order.entity");
const order_item_entity_1 = require("./orders/entities/order-item.entity");
const payment_entity_1 = require("./orders/entities/payment.entity");
const loyalty_account_entity_1 = require("./loyalty/entities/loyalty-account.entity");
const loyalty_transaction_entity_1 = require("./loyalty/entities/loyalty-transaction.entity");
const refresh_token_entity_1 = require("./auth/entities/refresh-token.entity");
const event_entity_1 = require("./events/entities/event.entity");
const uploads_module_1 = require("./uploads/uploads.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60, limit: 100 }]),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'postgres',
                    host: process.env.DB_HOST || 'localhost',
                    port: parseInt(process.env.DB_PORT || '5432', 10),
                    username: process.env.DB_USER || 'postgres',
                    password: process.env.DB_PASS || '',
                    database: process.env.DB_NAME || 'kariz_db',
                    entities: [
                        user_entity_1.User,
                        vendor_entity_1.Vendor,
                        category_entity_1.Category,
                        product_entity_1.Product,
                        product_translation_entity_1.ProductTranslation,
                        product_variant_entity_1.ProductVariant,
                        category_translation_entity_1.CategoryTranslation,
                        cart_entity_1.Cart,
                        cart_item_entity_1.CartItem,
                        order_entity_1.Order,
                        order_item_entity_1.OrderItem,
                        payment_entity_1.Payment,
                        loyalty_account_entity_1.LoyaltyAccount,
                        loyalty_transaction_entity_1.LoyaltyTransaction,
                        refresh_token_entity_1.RefreshToken,
                        event_entity_1.EventEntity,
                    ],
                    synchronize: true,
                }),
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            vendors_module_1.VendorsModule,
            catalog_module_1.CatalogModule,
            cart_module_1.CartModule,
            orders_module_1.OrdersModule,
            loyalty_module_1.LoyaltyModule,
            events_module_1.EventsModule,
            uploads_module_1.UploadsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map