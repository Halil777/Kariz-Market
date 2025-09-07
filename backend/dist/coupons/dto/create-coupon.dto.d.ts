export declare class CreateCouponDto {
    code: string;
    type: 'percent' | 'fixed';
    value: number;
    startsAt?: string;
    endsAt?: string;
    isActive?: boolean;
    nameTk?: string;
    nameRu?: string;
    imageUrl?: string | null;
}
