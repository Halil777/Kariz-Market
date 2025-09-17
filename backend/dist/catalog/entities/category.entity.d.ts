import { Vendor } from '../../vendors/entities/vendor.entity';
export declare class Category {
    id: string;
    slug: string;
    name: string;
    parent?: Category | null;
    parentId?: string | null;
    children: Category[];
    isActive: boolean;
    vendor?: Vendor | null;
    vendorId?: string | null;
    imageUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
