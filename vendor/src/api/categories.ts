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
  // Read global categories for vendor panel visibility
  const data = await api.get<CategoryDto[]>('/categories')
  return data
}

export const fetchCategoryTree = async (): Promise<CategoryNode[]> => {
  // Read global category tree for vendor panel visibility
  const data = await api.get<CategoryNode[]>('/categories/tree')
  return data
}
