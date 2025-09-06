import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryTranslation } from './entities/category-translation.entity';
export declare class CatalogService {
    private readonly catRepo;
    private readonly catTrRepo;
    private readonly prodRepo;
    constructor(catRepo: Repository<Category>, catTrRepo: Repository<CategoryTranslation>, prodRepo: Repository<Product>);
    listCategories(): Promise<Category[]>;
    listProducts(params: {
        categoryId?: string;
        vendorId?: string;
    }): Promise<Product[]>;
    getProduct(id: string): Promise<Product>;
    listCategoriesWithCounts(): Promise<any[]>;
    getCategoryTree(): Promise<any[]>;
    createCategory(dto: CreateCategoryDto): Promise<Category>;
    updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category>;
    deleteCategory(id: string): Promise<{
        ok: boolean;
    }>;
}
