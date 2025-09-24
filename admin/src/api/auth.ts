import { api } from './client'

export type LoginResponse = { accessToken: string; refreshToken: string }
export type Me = { id: string; email: string; role: string; vendorId?: string | null }

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export const me = async (): Promise<Me> => {
  const { data } = await api.get('/auth/me')
  return data
}

