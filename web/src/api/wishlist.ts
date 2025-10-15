import { api } from './client'
import { getDeviceId } from './client'

export const fetchWishlist = async () => {
  const { data } = await api.post('/wishlist/public/list', { deviceId: getDeviceId() })
  return data as Array<{ id: string; productId: string }>
}

export const toggleWishlist = async (productId: string) => {
  const { data } = await api.post('/wishlist/public/toggle', { deviceId: getDeviceId(), productId })
  return data as { added?: boolean; removed?: boolean }
}

