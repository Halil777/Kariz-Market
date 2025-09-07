import { CatalogService } from './catalog.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CatalogController {
    private readonly catalog;
    constructor(catalog: CatalogService);
    categories(): Promise<any[]>;
    products(categoryId?: string, vendorId?: string): Promise<import("./entities/product.entity").Product[]>;
    product(id: string): Promise<import("./entities/product.entity").Product>;
    categoryTree(): Promise<any[]>;
    createCategory(dto: CreateCategoryDto): Promise<import("./entities/category.entity").Category>;
    updateCategory(id: string, dto: UpdateCategoryDto): Promise<import("./entities/category.entity").Category>;
    removeCategory(id: string): Promise<{
        ok: boolean;
    }>;
}
