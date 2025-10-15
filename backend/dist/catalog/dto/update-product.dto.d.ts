export declare class UpdateProductDto {
    sku?: string;
    nameTk?: string;
    nameRu?: string;
    images?: string[];
    unit?: 'kg' | 'l' | 'count';
    price?: string;
    compareAt?: string | null;
    discountPct?: string;
    stock?: number;
    status?: string;
    categoryId?: string | null;
    specs?: Array<{
        titleTk?: string;
        titleRu?: string;
        textTk?: string;
        textRu?: string;
    }>;
}
