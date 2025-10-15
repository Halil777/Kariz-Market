import { Vendor } from '../../vendors/entities/vendor.entity';
import { Category } from './category.entity';
import { ProductTranslation } from './product-translation.entity';
import { ProductVariant } from './product-variant.entity';
export declare class Product {
    id: string;
    vendor?: Vendor | null;
    vendorId?: string | null;
    category?: Category | null;
    categoryId?: string | null;
    sku: string;
    status: string;
    images: string[];
    unit: string;
    price: string;
    compareAt?: string | null;
    discountPct: string;
    stock: number;
    taxClass?: string | null;
    brand?: string | null;
    specs: Array<{
        titleTk?: string | null;
        titleRu?: string | null;
        textTk?: string | null;
        textRu?: string | null;
    }>;
    translations: ProductTranslation[];
    variants: ProductVariant[];
    createdAt: Date;
    updatedAt: Date;
}
