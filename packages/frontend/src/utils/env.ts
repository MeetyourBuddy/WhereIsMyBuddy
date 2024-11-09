export function validateEnv() {
  const requiredEnvVars = ['VITE_API_BASE_URL', 'VITE_PORT'] as const;

  for (const envVar of requiredEnvVars) {
    if (!import.meta.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}
