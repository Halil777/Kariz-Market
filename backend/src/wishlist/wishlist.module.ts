import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WishlistItem } from './entities/wishlist.entity'
import { WishlistService } from './wishlist.service'
import { WishlistController } from './wishlist.controller'

@Module({
  imports: [TypeOrmModule.forFeature([WishlistItem])],
  providers: [WishlistService],
  controllers: [WishlistController],
  exports: [TypeOrmModule, WishlistService],
})
export class WishlistModule {}

