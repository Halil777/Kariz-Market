
const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api'
export const backendOrigin = (() => {
  try { return new URL(BASE_URL).origin } catch { return '' }
})()

export const absoluteAssetUrl = (url?: string | null) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('/uploads')) return `${backendOrigin}${url}`
  return url
}

function getAccessToken(): string | null {
  try {
    return localStorage.getItem('accessToken')
  } catch {
    return null
  }
}

export const uploadFile = async (file: File): Promise<string> => {
  const form = new FormData()
  form.append('file', file)
  const token = getAccessToken()
  const res = await fetch(`${BASE_URL}/uploads`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: form,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Upload failed: ${res.status} ${text}`)
  }
  const data = (await res.json()) as { url: string }
  return data.url
}
