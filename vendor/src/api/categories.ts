import { api } from './client'

export type CategoryDto = {
  id: string
  name: string
  parentId: string | null
  isActive: boolean
  imageUrl?: string | null
}

export type CategoryNode = CategoryDto & { children?: CategoryNode[] }

export const fetchCategories = async (): Promise<CategoryDto[]> => {
  const data = await api.get<CategoryDto[]>('/categories')
  return data
}

export const fetchCategoryTree = async (): Promise<CategoryNode[]> => {
  const data = await api.get<CategoryNode[]>('/categories/tree')
  return data
}

export const createCategory = async (payload: Partial<CategoryDto>) => {
  const data = await api.post<CategoryDto>('/categories', payload)
  return data
}

export const updateCategory = async (id: string, payload: Partial<CategoryDto>) => {
  const data = await api.patch<CategoryDto>(`/categories/${id}`, payload)
  return data
}

export const deleteCategory = async (id: string) => {
  const data = await api.delete<{ success: boolean }>(`/categories/${id}`)
  return data
}

