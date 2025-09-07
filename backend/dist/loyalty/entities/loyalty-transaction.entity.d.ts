import { LoyaltyAccount } from './loyalty-account.entity';
export declare class LoyaltyTransaction {
    id: string;
    account: LoyaltyAccount;
    accountId: string;
    type: string;
    points: number;
    refType?: string | null;
    refId?: string | null;
    ts: Date;
}
