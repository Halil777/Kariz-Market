import { api } from './client'

export type ProductDto = {
  id: string
  vendorId: null
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
}

export const fetchProducts = async (): Promise<ProductDto[]> => {
  const { data } = await api.get('/products')
  return data as ProductDto[]
}

export const getProduct = async (id: string): Promise<ProductDto> => {
  const { data } = await api.get(`/products/${id}`)
  return data as ProductDto
}

export const createProduct = async (payload: Partial<ProductDto> & { unit: 'kg' | 'l' | 'count'; price: number | string; stock: number }): Promise<ProductDto> => {
  const body: any = { ...payload }
  if (body.price !== undefined) body.price = String(body.price)
  if (body.compareAt !== undefined && body.compareAt !== null) body.compareAt = String(body.compareAt)
  if (body.discountPct !== undefined) body.discountPct = String(body.discountPct)
  const { data } = await api.post('/products', body)
  return data as ProductDto
}

export const updateProduct = async (id: string, payload: Partial<ProductDto>): Promise<ProductDto> => {
  const body: any = { ...payload }
  if (body.price !== undefined) body.price = String(body.price)
  if (body.compareAt !== undefined && body.compareAt !== null) body.compareAt = String(body.compareAt)
  if (body.discountPct !== undefined) body.discountPct = String(body.discountPct)
  const { data } = await api.patch(`/products/${id}`, body)
  return data as ProductDto
}

export const deleteProduct = async (id: string): Promise<{ ok: boolean }> => {
  const { data } = await api.delete(`/products/${id}`)
  return data as { ok: boolean }
}

