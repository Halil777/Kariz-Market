import { Repository } from 'typeorm';
import { LoyaltyAccount } from './entities/loyalty-account.entity';
export declare class LoyaltyService {
    private readonly repo;
    constructor(repo: Repository<LoyaltyAccount>);
    getOrCreate(userId: string): Promise<LoyaltyAccount>;
}
