export type ApiClient = {
  get<T>(path: string): Promise<T>
  post<T>(path: string, body?: any): Promise<T>
  patch<T>(path: string, body?: any): Promise<T>
  delete<T>(path: string): Promise<T>
}

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api'

function getAccessToken(): string | null {
  try {
    return localStorage.getItem('accessToken');
  } catch {
    return null;
  }
}

async function request<T>(method: string, path: string, body?: any): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${method} ${path} failed: ${res.status} ${text}`)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return (await res.json()) as T
  // @ts-ignore
  return undefined
}

export const api: ApiClient = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
}
