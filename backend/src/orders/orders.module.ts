import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Payment } from './entities/payment.entity';
import { User } from '../users/entities/user.entity';
import { ProductVariant } from '../catalog/entities/product-variant.entity';
import { Product } from '../catalog/entities/product.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Payment, User, ProductVariant, Product, Vendor]),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [TypeOrmModule],
})
export class OrdersModule {}

