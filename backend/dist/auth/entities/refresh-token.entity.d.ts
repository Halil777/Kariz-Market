import { User } from '../../users/entities/user.entity';
export declare class RefreshToken {
    id: string;
    user: User;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    createdAt: Date;
}
