import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
export declare class VendorsController {
    private readonly vendors;
    constructor(vendors: VendorsService);
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
    create(dto: CreateVendorDto): Promise<{
        vendorId: string;
    }>;
    me(req: any): Promise<import("./entities/vendor.entity").Vendor>;
    update(id: string, dto: UpdateVendorDto): Promise<import("./entities/vendor.entity").Vendor>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
