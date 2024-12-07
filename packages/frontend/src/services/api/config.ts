import { config } from '@/config';

export const API_CONFIG = {
  baseURL: config.api.baseURL || 'http://localhost:3000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
} as const;

export const COOKIE_CONFIG = {
  token: {
    name: 'accessToken',
    options: {
      secure: true,
      sameSite: 'strict' as const,
      path: '/',
      expires: 7
    }
  },
  refreshToken: {
    name: 'refreshToken',
    options: {
      secure: true,
      sameSite: 'strict' as const,
      path: '/',
      expires: 30
    }
  }
} as const;
