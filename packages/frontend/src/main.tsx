import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './styles/globals.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './providers/contexts/auth-context.tsx';
import { validateEnv } from './utils/env.ts';
import { Toaster } from '@/components/common/ui/toaster';

// Validate environment variables
validateEnv();

const queryClient = new QueryClient();

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element');
}
