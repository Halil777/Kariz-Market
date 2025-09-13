import { useQuery } from '@tanstack/react-query'
import { api } from './client'

export function useProducts() {
  return useQuery({ queryKey: ['products'], queryFn: () => api.get<any[]>('/products') })
}

