export declare class Category {
    id: string;
    slug: string;
    name: string;
    parent?: Category | null;
    parentId?: string | null;
    children: Category[];
    isActive: boolean;
    imageUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
