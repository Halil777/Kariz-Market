import { LoyaltyTransaction } from './loyalty-transaction.entity';
export declare class LoyaltyAccount {
    id: string;
    userId: string;
    pointsBalance: number;
    transactions: LoyaltyTransaction[];
}
