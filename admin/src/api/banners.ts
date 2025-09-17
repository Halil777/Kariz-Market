import { api } from './client';

export type BannerDto = {
  id?: string;
  imageUrl: string;
  titleTm?: string | null;
  titleRu?: string | null;
  subtitleTm?: string | null;
  subtitleRu?: string | null;
  order?: number;
  isActive?: boolean;
};

export const listBanners = async () => {
  const { data } = await api.get<BannerDto[]>('/banners');
  return data;
};

export const createBanner = async (payload: BannerDto) => {
  const { data } = await api.post<BannerDto>('/banners', payload);
  return data;
};

export const updateBanner = async (id: string, payload: Partial<BannerDto>) => {
  const { data } = await api.patch<BannerDto>(`/banners/${id}`, payload);
  return data;
};

export const deleteBanner = async (id: string) => {
  const { data } = await api.delete(`/banners/${id}`);
  return data;
};

