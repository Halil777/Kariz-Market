import { api } from './client';

export type Banner = {
  id: string;
  imageUrl: string;
  titleTm?: string | null;
  titleRu?: string | null;
  subtitleTm?: string | null;
  subtitleRu?: string | null;
  order?: number;
};

export const fetchBanners = async () => {
  const { data } = await api.get<Banner[]>('/banners', { params: { active: 1 } });
  return data;
};

