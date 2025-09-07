import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
export declare class CouponsService {
    private readonly repo;
    constructor(repo: Repository<Coupon>);
    list(): Promise<Coupon[]>;
    create(dto: CreateCouponDto): Promise<Coupon>;
    update(id: string, dto: UpdateCouponDto): Promise<Coupon>;
}
