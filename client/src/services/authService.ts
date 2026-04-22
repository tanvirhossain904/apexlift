import api from './api';
import type { User } from '../types';

export const register = (name: string, email: string, password: string, preferredUnit: 'kg' | 'lbs') =>
  api.post<{ token: string; user: User }>('/auth/register', { name, email, password, preferredUnit });

export const login = (email: string, password: string) =>
  api.post<{ token: string; user: User }>('/auth/login', { email, password });

export const getMe = () =>
  api.get<User>('/auth/me');
