import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
export declare class BannersController {
    private readonly banners;
    constructor(banners: BannersService);
    list(active?: string): Promise<import("./entities/banner.entity").Banner[]>;
    create(dto: CreateBannerDto): Promise<import("./entities/banner.entity").Banner>;
    update(id: string, dto: UpdateBannerDto): Promise<import("./entities/banner.entity").Banner>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
