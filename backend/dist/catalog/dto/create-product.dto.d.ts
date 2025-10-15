export declare class CreateProductDto {
    sku?: string;
    nameTk?: string;
    nameRu?: string;
    images?: string[];
    unit: 'kg' | 'l' | 'count';
    price: string;
    compareAt?: string;
    discountPct?: string;
    stock: number;
    status?: string;
    categoryId?: string | null;
    specs?: Array<{
        titleTk?: string;
        titleRu?: string;
        textTk?: string;
        textRu?: string;
    }>;
}
