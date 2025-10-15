import { api } from './client';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export type OrderItem = {
  id: string;
  variantId: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
  productName: string;
  productSku: string | null;
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
};

export type CreateOrderPayload = {
  paymentMethod: 'cash' | 'online';
  items: Array<{ variantId: string; qty: number }>;
};

export const listOrders = async (): Promise<OrderSummary[]> => {
  const { data } = await api.get<OrderSummary[]>('/orders');
  return data;
};

export const getOrder = async (id: string): Promise<OrderSummary> => {
  const { data } = await api.get<OrderSummary>(`/orders/${id}`);
  return data;
};

export const cancelOrder = async (id: string, reason?: string): Promise<OrderSummary> => {
  const { data } = await api.post<OrderSummary>(`/orders/${id}/cancel`, reason ? { reason } : {});
  return data;
};

export const createOrder = async (payload: CreateOrderPayload): Promise<OrderSummary> => {
  const { data } = await api.post<OrderSummary>('/orders', payload);
  return data;
};

