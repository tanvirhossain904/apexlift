import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) return 'Cannot reach server. Check your connection and try again.';
    const data = err.response.data as { message?: unknown } | undefined;
    if (data && typeof data.message === 'string') return data.message;
  }
  return fallback;
}

export default api;
