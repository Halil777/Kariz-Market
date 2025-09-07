import { Vendor } from '../../vendors/entities/vendor.entity';
import { Category } from './category.entity';
import { ProductTranslation } from './product-translation.entity';
import { ProductVariant } from './product-variant.entity';
export declare class Product {
    id: string;
    vendor: Vendor;
    vendorId: string;
    category?: Category | null;
    categoryId?: string | null;
    sku: string;
    status: string;
    taxClass?: string | null;
    brand?: string | null;
    translations: ProductTranslation[];
    variants: ProductVariant[];
    createdAt: Date;
    updatedAt: Date;
}
