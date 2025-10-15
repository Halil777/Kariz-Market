import { api } from './client';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export type OrderCustomer = {
  id: string;
  email: string;
  phone: string | null;
  displayName: string | null;
};

export type OrderVendor = {
  id: string;
  name: string;
};

export type OrderItem = {
  id: string;
  variantId: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
  productName: string;
  productSku: string | null;
  attributes: Record<string, any> | null;
  vendorId: string | null;
  vendorName: string | null;
};

export type OrderSummary = {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  currency: string;
  placedAt: string | null;
  updatedAt: string | null;
  cancellationReason: string | null;
  cancelledAt: string | null;
  items: OrderItem[];
  itemCount: number;
  vendors: OrderVendor[];
  customer?: OrderCustomer;
};

export const listOrders = async (params: {
  status?: OrderStatus | 'all';
  q?: string;
  vendorId?: string;
} = {}): Promise<OrderSummary[]> => {
  const query: Record<string, string> = {};
  if (params.status && params.status !== 'all') query.status = params.status;
  if (params.q) query.q = params.q;
  if (params.vendorId) query.vendorId = params.vendorId;
  const { data } = await api.get<OrderSummary[]>('/orders/admin', {
    params: Object.keys(query).length ? query : undefined,
  });
  return data;
};

export const getOrder = async (id: string): Promise<OrderSummary> => {
  const { data } = await api.get<OrderSummary>(`/orders/admin/${id}`);
  return data;
};

