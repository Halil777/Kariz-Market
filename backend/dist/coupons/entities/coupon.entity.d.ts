export type CouponType = 'percent' | 'fixed';
export declare class Coupon {
    id: string;
    code: string;
    type: CouponType;
    value: string;
    startsAt?: string | null;
    endsAt?: string | null;
    usageCount: number;
    isActive: boolean;
    nameTk?: string | null;
    nameRu?: string | null;
    imageUrl?: string | null;
    createdAt: Date;
}
