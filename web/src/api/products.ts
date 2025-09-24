import { api } from './client';

export type ProductSummary = {
  id: string;
  nameTk?: string | null;
  nameRu?: string | null;
  categoryNameTk?: string | null;
  categoryNameRu?: string | null;
  images: string[];
  price: number;
  compareAt?: number | null;
  discountPct?: number;
  unit: string;
  stock: number;
  vendorId?: string | null;
  categoryId?: string | null;
  createdAt?: string;
};

export type HomeHighlightsResponse = {
  top: ProductSummary[];
  deals: ProductSummary[];
};

export const fetchHomeHighlights = async (limit = 10) => {
  const { data } = await api.get<HomeHighlightsResponse>('/products/highlights', {
    params: { limit },
  });
  return data;
};

export const fetchProducts = async (categoryId?: string) => {
  const { data } = await api.get<ProductSummary[]>('/products/all', { params: { categoryId } })
  return data
}
