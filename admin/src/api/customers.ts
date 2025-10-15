import { api } from './client';

export type Customer = {
  id: string;
  email: string;
  displayName: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  lastOrderAt: string | null;
  orderCount: number;
  totalSpent: number;
  loyaltyPoints: number;
};

const normalizeCustomer = (raw: any): Customer => ({
  id: raw.id,
  email: raw.email,
  displayName: raw.displayName ?? null,
  phone: raw.phone ?? null,
  isActive: Boolean(raw.isActive),
  createdAt: raw.createdAt,
  lastOrderAt: raw.lastOrderAt ?? null,
  orderCount: Number(raw.orderCount ?? 0),
  totalSpent: Number(raw.totalSpent ?? 0),
  loyaltyPoints: Number(raw.loyaltyPoints ?? 0),
});

export const listCustomers = async (q?: string): Promise<Customer[]> => {
  const { data } = await api.get('/customers', { params: q ? { q } : undefined });
  return (Array.isArray(data) ? data : []).map(normalizeCustomer);
};

export const updateCustomer = async (id: string, payload: Partial<Customer>) => {
  const { data } = await api.patch(`/customers/${id}`, payload);
  return normalizeCustomer(data);
};

