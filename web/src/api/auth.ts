import { api } from './client';

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export const register = async (payload: {
  email: string;
  password: string;
  displayName?: string;
  phone?: string;
}): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  return data;
};

export const login = async (payload: { email: string; password: string }): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  return data;
};
