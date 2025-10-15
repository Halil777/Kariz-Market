import { api } from './client'

export type ProductDto = {
  id: string
  vendorId: string
  categoryId: string | null
  sku: string
  status: string
  images: string[]
  unit: 'kg' | 'l' | 'count'
  price: number
  compareAt: number | null
  discountPct: number
  stock: number
  nameTk?: string
  nameRu?: string
  specs?: Array<{ titleTk?: string; titleRu?: string; textTk?: string; textRu?: string }>
}

export const fetchProducts = async (categoryId?: string): Promise<ProductDto[]> => {
  const qs = categoryId ? `?categoryId=${encodeURIComponent(categoryId)}` : ''
  return await api.get<ProductDto[]>(`/vendor/products${qs}`)
}

export const getProduct = async (id: string): Promise<ProductDto> => {
  return await api.get<ProductDto>(`/vendor/products/${id}`)
}

export const createProduct = async (payload: Partial<ProductDto> & { sku: string; unit: 'kg' | 'l' | 'count'; price: number | string; stock: number }): Promise<ProductDto> => {
  // Backend expects numeric strings for price fields
  const body: any = { ...payload }
  if (body.price !== undefined) body.price = String(body.price)
  if (body.compareAt !== undefined && body.compareAt !== null) body.compareAt = String(body.compareAt)
  if (body.discountPct !== undefined) body.discountPct = String(body.discountPct)
  return await api.post<ProductDto>('/vendor/products', body)
}

export const updateProduct = async (id: string, payload: Partial<ProductDto>): Promise<ProductDto> => {
  const body: any = { ...payload }
  if (body.price !== undefined) body.price = String(body.price)
  if (body.compareAt !== undefined && body.compareAt !== null) body.compareAt = String(body.compareAt)
  if (body.discountPct !== undefined) body.discountPct = String(body.discountPct)
  return await api.patch<ProductDto>(`/vendor/products/${id}`, body)
}

export const deleteProduct = async (id: string): Promise<{ ok: boolean }> => {
  return await api.delete<{ ok: boolean }>(`/vendor/products/${id}`)
}
