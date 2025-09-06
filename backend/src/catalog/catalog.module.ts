import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductTranslation } from './entities/product-translation.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { CategoryTranslation } from './entities/category-translation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, CategoryTranslation, Product, ProductTranslation, ProductVariant]),
  ],
  providers: [CatalogService],
  controllers: [CatalogController],
  exports: [TypeOrmModule],
})
export class CatalogModule {}
