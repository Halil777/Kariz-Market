import { api } from './client'

export type Vendor = {
  id: string
  name: string
  slug: string
  status: string
  location: string
  createdAt: string
}

export async function getMyVendor(): Promise<Vendor | null> {
  try {
    const vendor = await api.get<Vendor>('/vendors/me')
    // api.get returns the JSON body directly
    return vendor as any
  } catch (e) {
    return null
  }
}
