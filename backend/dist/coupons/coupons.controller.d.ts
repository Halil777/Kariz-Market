import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
export declare class CouponsController {
    private readonly coupons;
    constructor(coupons: CouponsService);
    list(): Promise<import("./entities/coupon.entity").Coupon[]>;
    create(dto: CreateCouponDto): Promise<import("./entities/coupon.entity").Coupon>;
    update(id: string, dto: UpdateCouponDto): Promise<import("./entities/coupon.entity").Coupon>;
}
