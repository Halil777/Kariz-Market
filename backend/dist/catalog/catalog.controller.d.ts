import { CatalogService } from './catalog.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class CatalogController {
    private readonly catalog;
    constructor(catalog: CatalogService);
    categories(): Promise<any[]>;
    products(categoryId?: string): Promise<any[]>;
    productsAll(categoryId?: string): Promise<any[]>;
    productHighlights(limit?: string): Promise<{
        top: any[];
        deals: any[];
    }>;
    product(id: string): Promise<any>;
    categoryTree(): Promise<any[]>;
    createCategory(dto: CreateCategoryDto): Promise<import("./entities/category.entity").Category>;
    updateCategory(id: string, dto: UpdateCategoryDto): Promise<import("./entities/category.entity").Category>;
    removeCategory(id: string): Promise<{
        ok: boolean;
    }>;
    createProduct(dto: CreateProductDto): Promise<any>;
    updateProduct(id: string, dto: UpdateProductDto): Promise<any>;
    removeProduct(id: string): Promise<{
        ok: boolean;
    }>;
    vendorCategories(req: any): Promise<any[]>;
    vendorCategoryTree(req: any): Promise<any[]>;
    updateVendorCategory(req: any, id: string, dto: UpdateCategoryDto): Promise<import("./entities/category.entity").Category>;
    removeVendorCategory(req: any, id: string): Promise<{
        ok: boolean;
    }>;
    vendorProducts(req: any, categoryId?: string): Promise<any[]>;
    vendorProduct(req: any, id: string): Promise<any>;
    createVendorProduct(req: any, dto: CreateProductDto): Promise<any>;
    updateVendorProduct(req: any, id: string, dto: UpdateProductDto): Promise<any>;
    deleteVendorProduct(req: any, id: string): Promise<{
        ok: boolean;
    }>;
}
