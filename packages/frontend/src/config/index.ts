export const config = {
  api: {
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api',
    port: parseInt(import.meta.env.VITE_PORT, 10)
  }
} as const;
