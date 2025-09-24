import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryTranslation } from './entities/category-translation.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductTranslation } from './entities/product-translation.entity';
export declare class CatalogService implements OnModuleInit {
    private readonly catRepo;
    private readonly catTrRepo;
    private readonly prodRepo;
    private readonly prodTrRepo;
    constructor(catRepo: Repository<Category>, catTrRepo: Repository<CategoryTranslation>, prodRepo: Repository<Product>, prodTrRepo: Repository<ProductTranslation>);
    private generateUniqueSku;
    private computePricing;
    onModuleInit(): Promise<void>;
    private backfillCategoryOwnership;
    listCategories(vendorId?: string | null): Promise<Category[]>;
    listProducts(params: {
        categoryId?: string;
        vendorId?: string | null;
    }): Promise<any[]>;
    private collectDescendantCategoryIds;
    private mapProductsWithTranslations;
    private serializeProduct;
    getHomeHighlights(limit?: number): Promise<{
        top: any[];
        deals: any[];
    }>;
    getProduct(id: string): Promise<Product>;
    listCategoriesWithCounts(vendorId?: string | null): Promise<any[]>;
    getCategoryTree(vendorId?: string | null): Promise<any[]>;
    createCategory(dto: CreateCategoryDto, vendorId?: string | null): Promise<Category>;
    updateCategory(id: string, dto: UpdateCategoryDto, vendorId?: string | null): Promise<Category>;
    deleteCategory(id: string, vendorId?: string | null): Promise<{
        ok: boolean;
    }>;
    listVendorProducts(vendorId: string, categoryId?: string): Promise<any[]>;
    getVendorProduct(id: string, vendorId: string): Promise<any>;
    createVendorProduct(vendorId: string, dto: CreateProductDto): Promise<any>;
    updateVendorProduct(id: string, vendorId: string, dto: UpdateProductDto): Promise<any>;
    deleteVendorProduct(id: string, vendorId: string): Promise<{
        ok: boolean;
    }>;
    getGlobalProduct(id: string): Promise<any>;
    createGlobalProduct(dto: CreateProductDto): Promise<any>;
    updateGlobalProduct(id: string, dto: UpdateProductDto): Promise<any>;
    deleteGlobalProduct(id: string): Promise<{
        ok: boolean;
    }>;
}
