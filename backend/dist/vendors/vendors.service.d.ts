import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { User } from '../users/entities/user.entity';
export declare class VendorsService {
    private readonly vendorRepo;
    private readonly userRepo;
    constructor(vendorRepo: Repository<Vendor>, userRepo: Repository<User>);
    create(dto: CreateVendorDto): Promise<{
        vendorId: string;
    }>;
    list(): Promise<{
        id: string;
        name: string;
        slug: string;
        status: string;
        location: import("./entities/vendor.entity").VendorLocation;
        createdAt: Date;
        email: string;
        phone: string;
    }[]>;
    getMe(userId: string): Promise<Vendor>;
    update(id: string, dto: UpdateVendorDto): Promise<Vendor>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
