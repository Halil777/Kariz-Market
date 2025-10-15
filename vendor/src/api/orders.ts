import { api } from './client'

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

export type OrderCustomer = {
  id: string
  email: string
  phone: string | null
  displayName: string | null
}

export type OrderItem = {
  id: string
  variantId: string
  qty: number
  unitPrice: number
  subtotal: number
  productName: string
  productSku: string | null
  vendorId: string | null
  vendorName: string | null
}

export type OrderSummary = {
  id: string
  userId: string
  status: OrderStatus
  total: number
  currency: string
  placedAt: string | null
  updatedAt: string | null
  cancellationReason: string | null
  cancelledAt: string | null
  items: OrderItem[]
  itemCount: number
  customer?: OrderCustomer
}

export const listOrders = async (params: { status?: OrderStatus | 'all' } = {}) => {
  const query: Record<string, string> = {}
  if (params.status && params.status !== 'all') query.status = params.status
  return api.get<OrderSummary[]>('/orders/vendor' + (Object.keys(query).length ? `?${new URLSearchParams(query)}` : ''))
}

export const getOrder = async (id: string) => {
  return api.get<OrderSummary>(`/orders/vendor/${id}`)
}

