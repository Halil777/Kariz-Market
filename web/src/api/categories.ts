import { api } from "./client";

export type CategoryDto = {
  id: string;
  name: string;
  nameTk?: string;
  nameRu?: string;
  parentId?: string | null;
  isActive: boolean;
  imageUrl?: string | null;
};

export type CategoryNode = CategoryDto & { children?: CategoryNode[] };

export const fetchCategoryTree = async (): Promise<CategoryNode[]> => {
  const { data } = await api.get("/categories/tree");
  return data;
};
