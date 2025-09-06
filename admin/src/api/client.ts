import axios from 'axios';

// Vite injects import.meta.env at runtime, but TS needs typing safety. Use string cast.
const baseURL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const api = axios.create({ baseURL });

export const backendOrigin = (() => {
  try { return new URL(baseURL).origin; } catch { return ''; }
})();

export const absoluteAssetUrl = (url?: string | null) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) return `${backendOrigin}${url}`;
  return url;
};
