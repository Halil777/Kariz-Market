import { Product } from './product.entity';
export declare class ProductTranslation {
    id: string;
    product: Product;
    productId: string;
    locale: string;
    name: string;
    description?: string | null;
}
