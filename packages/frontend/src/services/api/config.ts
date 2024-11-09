import { config } from '@/config';

export const API_CONFIG = {
  baseURL: config.api.baseURL || 'http://localhost:3000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
} as const;

export const COOKIE_CONFIG = {
  token: {
    name: 'auth_token',
    options: {
      secure: true,
      sameSite: 'strict' as const,
      path: '/',
      expires: 7
    }
  },
  refreshToken: {
    name: 'refresh_token',
    options: {
      secure: true,
      sameSite: 'strict' as const,
      path: '/',
      expires: 30
    }
  }
} as const;
