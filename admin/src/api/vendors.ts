import { api } from './client';

export type VendorLocation = 'Dashoguz' | 'Balkan' | 'Lebap' | 'Mary' | 'Ahal' | 'Ashgabat';

export type VendorListItem = {
  id: string;
  name: string;
  status: 'active' | 'suspended' | string;
  createdAt: string;
  email: string | null;
  phone: string | null;
  location: VendorLocation;
};

export type CreateVendorPayload = {
  name: string;
  email: string; // login
  password: string;
  phone?: string;
  location: VendorLocation;
  displayName?: string;
};

export async function listVendors() {
  const { data } = await api.get<VendorListItem[]>('/vendors');
  return (Array.isArray(data) ? data : []).map((v: any) => ({
    ...v,
    createdAt: typeof v.createdAt === 'string' ? v.createdAt.slice(0, 10) : '',
  }));
}

export async function createVendor(payload: CreateVendorPayload) {
  const { data } = await api.post<{ vendorId: string }>('/vendors', payload);
  return data;
}

export async function updateVendor(id: string, payload: Partial<{ name: string; status: string; location: VendorLocation }>) {
  const { data } = await api.patch(`/vendors/${id}`, payload);
  return data as VendorListItem;
}

export async function deleteVendor(id: string) {
  const { data } = await api.delete(`/vendors/${id}`);
  return data;
}
