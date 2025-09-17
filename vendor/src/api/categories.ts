import { api } from './client'

export type CategoryDto = {
  id: string
  name?: string
  nameTk?: string
  nameRu?: string
  parentId: string | null
  isActive: boolean
  imageUrl?: string | null
}

export type CategoryNode = CategoryDto & { children?: CategoryNode[] }

export const fetchCategories = async (): Promise<CategoryDto[]> => {
  const data = await api.get<CategoryDto[]>('/vendor/categories')
  return data
}

export const fetchCategoryTree = async (): Promise<CategoryNode[]> => {
  const data = await api.get<CategoryNode[]>('/vendor/categories/tree')
  return data
}

export const createCategory = async (payload: Partial<CategoryDto>) => {
  const data = await api.post<CategoryDto>('/vendor/categories', payload)
  return data
}

export const updateCategory = async (id: string, payload: Partial<CategoryDto>) => {
  const data = await api.patch<CategoryDto>(`/vendor/categories/${id}`, payload)
  return data
}

export const deleteCategory = async (id: string) => {
  const data = await api.delete<{ success: boolean }>(`/vendor/categories/${id}`)
  return data
}
