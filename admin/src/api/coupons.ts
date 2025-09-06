import { api } from './client';

export type Coupon = {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  startsAt?: string | null;
  endsAt?: string | null;
  usageCount: number;
  isActive: boolean;
  nameTk?: string | null;
  nameRu?: string | null;
  imageUrl?: string | null;
};

export const listCoupons = async (): Promise<Coupon[]> => {
  const { data } = await api.get('/coupons');
  return data.map((c: any) => ({ ...c, value: Number(c.value) })) as Coupon[];
};

export const createCoupon = async (payload: Partial<Coupon>) => {
  const { data } = await api.post('/coupons', payload);
  return data as Coupon;
};

export const updateCoupon = async (id: string, payload: Partial<Coupon>) => {
  const { data } = await api.patch(`/coupons/${id}`, payload);
  return data as Coupon;
};

