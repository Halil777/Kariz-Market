import axios from 'axios';
import i18n from '../i18n/setup';

export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const api = axios.create({ baseURL: API_BASE_URL });

// Attach current UI language to requests so backend can localize if supported
api.interceptors.request.use((config) => {
  const lang = (i18n.language || 'tk').split('-')[0];
  config.headers = {
    ...(config.headers || {}),
    'Accept-Language': lang,
  } as any;
  return config;
});

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

export const getDeviceId = (): string => {
  try {
    const key = 'deviceId';
    let v = localStorage.getItem(key);
    if (!v) {
      v = crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(key, v);
    }
    return v;
  } catch {
    return 'anon-device';
  }
};
