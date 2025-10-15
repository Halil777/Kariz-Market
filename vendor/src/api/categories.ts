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

export const fetchVendorCategories = async (): Promise<CategoryDto[]> => {
  const data = await api.get<CategoryDto[]>('/vendor/categories')
  return data
}

export const fetchCombinedCategories = async (): Promise<CategoryDto[]> => {
  const [global, vendor] = await Promise.all([
    api.get<CategoryDto[]>('/categories'),
    api.get<CategoryDto[]>('/vendor/categories'),
  ])
  const map = new Map<string, CategoryDto>()
  for (const c of [...global, ...vendor]) map.set(c.id, c)
  return Array.from(map.values())
}

export const fetchCategoryTree = async (): Promise<CategoryNode[]> => {
  // Read global category tree for vendor panel visibility
  const data = await api.get<CategoryNode[]>('/categories/tree')
  return data
}

export const fetchVendorCategoryTree = async (): Promise<CategoryNode[]> => {
  const data = await api.get<CategoryNode[]>('/vendor/categories/tree')
  return data
}

export const fetchCombinedCategoryTree = async (): Promise<CategoryNode[]> => {
  const [global, vendor] = await Promise.all([
    api.get<CategoryNode[]>('/categories/tree'),
    api.get<CategoryNode[]>('/vendor/categories/tree'),
  ])
  // Shallow merge: separate roots for global and vendor trees
  return [...(global || []), ...(vendor || [])]
}
