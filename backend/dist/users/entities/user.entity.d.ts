import { Role } from '../../common/enums/role.enum';
export declare class User {
    id: string;
    email: string;
    phone?: string | null;
    passwordHash: string;
    role: Role;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
