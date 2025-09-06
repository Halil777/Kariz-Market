import { api } from './client';

export type CategoryDto = {
  id: string;
  name: string;
  nameTk?: string;
  nameRu?: string;
  parentId?: string | null;
  isActive: boolean;
  productCount?: number;
  imageUrl?: string | null;
};

export type CategoryNode = CategoryDto & { children?: CategoryNode[] };

export const fetchCategories = async (): Promise<CategoryDto[]> => {
  const { data } = await api.get('/categories');
  return data;
};

export const fetchCategoryTree = async (): Promise<CategoryNode[]> => {
  const { data } = await api.get('/categories/tree');
  return data;
};

export const createCategory = async (payload: { name?: string; nameTk?: string; nameRu?: string; parentId?: string | null; isActive?: boolean; imageUrl?: string | null }) => {
  const { data } = await api.post('/categories', payload);
  return data as CategoryDto;
};

export const updateCategory = async (id: string, payload: Partial<{ name: string; nameTk: string; nameRu: string; parentId: string | null; isActive: boolean; imageUrl: string | null }>) => {
  const { data } = await api.patch(`/categories/${id}`, payload);
  return data as CategoryDto;
};

export const deleteCategory = async (id: string) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
};
