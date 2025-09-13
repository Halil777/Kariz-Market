import { VendorLocation } from '../entities/vendor.entity';
export declare class UpdateVendorDto {
    name?: string;
    status?: 'active' | 'suspended' | string;
    location?: VendorLocation;
}
