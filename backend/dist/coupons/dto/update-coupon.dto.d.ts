export declare class UpdateCouponDto {
    code?: string;
    type?: 'percent' | 'fixed';
    value?: number;
    startsAt?: string | null;
    endsAt?: string | null;
    isActive?: boolean;
    nameTk?: string | null;
    nameRu?: string | null;
    imageUrl?: string | null;
}
