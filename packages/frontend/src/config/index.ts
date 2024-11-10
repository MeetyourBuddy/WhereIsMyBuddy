export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    port: parseInt(import.meta.env.VITE_PORT, 10)
  }
} as const;
