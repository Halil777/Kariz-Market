import { api } from './client'

export type ProductDto = {
  id: string
  vendorId: string | null
  categoryId: string | null
  categoryNameTk?: string | null
  categoryNameRu?: string | null
  sku: string
  status: string
  images: string[]
  unit: 'kg' | 'l' | 'count'
  price: number
  compareAt: number | null
  discountPct: number
  stock: number
  nameTk?: string | null
  nameRu?: string | null
  specs?: Array<{ titleTk?: string; titleRu?: string; textTk?: string; textRu?: string }>
}

export const fetchProducts = async (): Promise<ProductDto[]> => {
  const { data } = await api.get('/products')
  return data as ProductDto[]
}

export const getProduct = async (id: string): Promise<ProductDto> => {
  const { data } = await api.get(`/products/${id}`)
  return data as ProductDto
}

const normalisePayload = (payload: Partial<ProductDto>) => {
  const body: any = { ...payload }
  delete body.id
  delete body.categoryNameTk
  delete body.categoryNameRu
  delete body.vendorId
  // specs is accepted as-is
  if (body.price !== undefined) body.price = String(body.price)
  if (body.compareAt !== undefined && body.compareAt !== null) body.compareAt = String(body.compareAt)
  if (body.discountPct !== undefined) body.discountPct = String(body.discountPct)
  return body
}

export const createProduct = async (payload: Partial<ProductDto> & { unit: 'kg' | 'l' | 'count'; price: number | string; stock: number }): Promise<ProductDto> => {
  const { data } = await api.post('/products', normalisePayload(payload))
  return data as ProductDto
}

export const updateProduct = async (id: string, payload: Partial<ProductDto>): Promise<ProductDto> => {
  const { data } = await api.patch(`/products/${id}`, normalisePayload(payload))
  return data as ProductDto
}

export const deleteProduct = async (id: string): Promise<{ ok: boolean }> => {
  const { data } = await api.delete(`/products/${id}`)
  return data as { ok: boolean }
}
