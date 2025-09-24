import { OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from './users.service';
export declare class SeedAdminProvider implements OnApplicationBootstrap {
    private readonly users;
    private readonly logger;
    constructor(users: UsersService);
    onApplicationBootstrap(): Promise<void>;
}
