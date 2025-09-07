import { api } from './client';

export type Customer = {
  id: string;
  email: string;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
};

export const listCustomers = async (q?: string): Promise<Customer[]> => {
  const { data } = await api.get('/customers', { params: q ? { q } : undefined });
  return data as Customer[];
};

export const updateCustomer = async (id: string, payload: Partial<Customer>) => {
  const { data } = await api.patch(`/customers/${id}`, payload);
  return data as Customer;
};

