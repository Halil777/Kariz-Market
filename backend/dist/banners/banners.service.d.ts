import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
export declare class BannersService {
    private readonly repo;
    constructor(repo: Repository<Banner>);
    list(activeOnly?: boolean): Promise<Banner[]>;
    create(dto: CreateBannerDto): Promise<Banner>;
    update(id: string, dto: UpdateBannerDto): Promise<Banner>;
    remove(id: string): Promise<{
        id: string;
    }>;
    private nextOrderValue;
}
