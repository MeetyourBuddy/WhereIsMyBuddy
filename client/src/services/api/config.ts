export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://whereismybuddy-1.onrender.com/api',
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
      expires: 3600, // seconds
      path: '/',
      secure: import.meta.env.PROD,
      sameSite: 'strict'
    }
  },
  refreshToken: {
    name: 'refreshToken',
    options: {
      expires: 604800, // 7 days in seconds
      path: '/',
      secure: import.meta.env.PROD,
      sameSite: 'strict'
    }
  }
} as const;
