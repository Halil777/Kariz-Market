import { VendorLocation } from '../entities/vendor.entity';
export declare class CreateVendorDto {
    name: string;
    email: string;
    password: string;
    phone?: string;
    location: VendorLocation;
    displayName?: string;
}
