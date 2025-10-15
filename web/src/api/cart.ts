import { api } from './client'
import { getDeviceId } from './client'

export type CartItemDto = { id: string; variantId: string; qty: number; priceSnapshot: string }
export type CartDto = { id: string; items: CartItemDto[] }

export const fetchCart = async (): Promise<CartDto> => {
  const { data } = await api.post('/cart/public/get', { deviceId: getDeviceId() })
  return data
}

export const addToCart = async (productId: string, price: number, qty = 1): Promise<CartDto> => {
  const { data } = await api.post('/cart/public/items', { deviceId: getDeviceId(), productId, price: String(price), qty })
  return data
}

