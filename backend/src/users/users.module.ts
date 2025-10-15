import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { OrdersModule } from '../orders/orders.module';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { AccountController } from './account.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), OrdersModule, LoyaltyModule],
  providers: [UsersService],
  controllers: [UsersController, AccountController],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}

