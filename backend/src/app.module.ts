import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { VendorsModule } from './vendors/vendors.module';
import { CatalogModule } from './catalog/catalog.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { LoyaltyModule } from './loyalty/loyalty.module';
import { EventsModule } from './events/events.module';
import { User } from './users/entities/user.entity';
import { Vendor } from './vendors/entities/vendor.entity';
import { Category } from './catalog/entities/category.entity';
import { Product } from './catalog/entities/product.entity';
import { ProductTranslation } from './catalog/entities/product-translation.entity';
import { ProductVariant } from './catalog/entities/product-variant.entity';
import { CategoryTranslation } from './catalog/entities/category-translation.entity';
import { Cart } from './cart/entities/cart.entity';
import { CartItem } from './cart/entities/cart-item.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { Payment } from './orders/entities/payment.entity';
import { LoyaltyAccount } from './loyalty/entities/loyalty-account.entity';
import { LoyaltyTransaction } from './loyalty/entities/loyalty-transaction.entity';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { EventEntity } from './events/entities/event.entity';
import { UploadsModule } from './uploads/uploads.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 100 }]),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'kariz_db',
        entities: [
          User,
          Vendor,
          Category,
          Product,
          ProductTranslation,
          ProductVariant,
          CategoryTranslation,
          Cart,
          CartItem,
          Order,
          OrderItem,
          Payment,
          LoyaltyAccount,
          LoyaltyTransaction,
          RefreshToken,
          EventEntity,
        ],
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    VendorsModule,
    CatalogModule,
    CartModule,
    OrdersModule,
    LoyaltyModule,
    EventsModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
