import { api } from './client';

export type OverviewResponse = {
  range: { from: string; to: string };
  totals: { revenue: number; orders: number; avgOrderValue: number; newCustomers: number };
  salesByDay: { date: string; revenue: number; orders: number }[];
};

export const getOverview = async (from?: string, to?: string): Promise<OverviewResponse> => {
  const { data } = await api.get('/reports/overview', { params: { from, to } });
  return data as OverviewResponse;
};

