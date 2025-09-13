export declare enum VendorLocation {
    Dashoguz = "Dashoguz",
    Balkan = "Balkan",
    Lebap = "Lebap",
    Mary = "Mary",
    Ahal = "Ahal",
    Ashgabat = "Ashgabat"
}
export declare class Vendor {
    id: string;
    name: string;
    slug: string;
    status: string;
    commissionType: string;
    commissionValue: string;
    location: VendorLocation;
    createdAt: Date;
    updatedAt: Date;
}
