import { api } from './client';

export const uploadFile = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/uploads', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data.url as string;
};

