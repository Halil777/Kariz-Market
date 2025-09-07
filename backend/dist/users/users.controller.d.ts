import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly repo;
    constructor(repo: Repository<User>);
    list(q?: string): Promise<User[]>;
    update(id: string, dto: UpdateUserDto): Promise<User>;
}
