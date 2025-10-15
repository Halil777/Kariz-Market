import { api } from './client';
import type { OrderStatus } from './orders';

export type AccountVendor = { id: string; name: string };

export type AccountOverview = {
  user: {
    id: string;
    email: string;
    displayName: string | null;
    phone: string | null;
    createdAt: string;
  };
  stats: {
    totalOrders: number;
    openOrders: number;
    totalSpent: number;
    loyaltyPoints: number;
    lastOrderAt: string | null;
  };
  recentOrders: Array<{
    id: string;
    status: OrderStatus;
    total: number;
    currency: string;
    placedAt: string | null;
    itemCount: number;
    vendors: AccountVendor[];
  }>;
};

export const fetchAccountOverview = async (): Promise<AccountOverview> => {
  const { data } = await api.get<AccountOverview>('/account/overview');
  return data;
};
