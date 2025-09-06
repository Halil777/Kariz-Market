import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from '../users/entities/user.entity';
export declare class AuthService {
    private readonly users;
    private readonly jwt;
    private readonly refreshRepo;
    constructor(users: UsersService, jwt: JwtService, refreshRepo: Repository<RefreshToken>);
    validateUser(email: string, password: string): Promise<User>;
    private signAccessToken;
    private signRefreshToken;
    issueTokens(user: User): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    register(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(userId: string, token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
