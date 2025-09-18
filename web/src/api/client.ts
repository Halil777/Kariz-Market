import axios from 'axios';

export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const api = axios.create({ baseURL: API_BASE_URL });

export const backendOrigin = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return '';
  }
})();

export const absoluteAssetUrl = (url?: string | null) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) return `${backendOrigin}${url}`;
  return url;
};
