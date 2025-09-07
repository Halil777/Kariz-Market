import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly repo;
    constructor(repo: Repository<User>);
    findByEmail(email: string): Promise<User>;
    findById(id: string): Promise<User>;
    create(user: Partial<User>): Promise<User>;
}
