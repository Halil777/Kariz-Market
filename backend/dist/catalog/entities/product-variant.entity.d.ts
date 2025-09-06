import { Product } from './product.entity';
export declare class ProductVariant {
    id: string;
    product: Product;
    productId: string;
    sku: string;
    price: string;
    compareAt?: string | null;
    attributes: Record<string, any>;
    barcode?: string | null;
    stockOnHand: number;
    stockReserved: number;
}
