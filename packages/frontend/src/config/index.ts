export const config = {
  api: {
    baseURL: 'http://localhost:3000',
    port: parseInt(import.meta.env.VITE_PORT, 10)
  }
} as const;
