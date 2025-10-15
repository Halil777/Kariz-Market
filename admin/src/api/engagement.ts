import { api } from './client'

export const getWishlistRegistered = async (): Promise<Array<{ userId: string; count: number }>> => {
  const { data } = await api.get('/wishlist/admin/registered')
  return data
}

export const getWishlistGuests = async (): Promise<Array<{ deviceId: string; count: number }>> => {
  const { data } = await api.get('/wishlist/admin/guests')
  return data
}

export const getCartRegistered = async (): Promise<Array<{ userId: string; count: number }>> => {
  const { data } = await api.get('/cart/admin/registered')
  return data
}

export const getCartGuests = async (): Promise<Array<{ deviceId: string; count: number }>> => {
  const { data } = await api.get('/cart/admin/guests')
  return data
}

