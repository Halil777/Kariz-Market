import { LoyaltyService } from './loyalty.service';
export declare class LoyaltyController {
    private readonly loyalty;
    constructor(loyalty: LoyaltyService);
    get(req: any): Promise<import("./entities/loyalty-account.entity").LoyaltyAccount>;
}
