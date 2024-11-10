import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './providers/contexts/auth-context.tsx';
import { validateEnv } from './utils/env.ts';

// Validate environment variables
// validateEnv();

const queryClient = new QueryClient();

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <NextUIProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <App />
            <Toaster
              toastOptions={{
                style: {
                  border: '1px solid gray-200',
                  padding: '16px',
                  minWidth: '300px'
                },
                position: 'top-right'
              }}
            />
          </QueryClientProvider>
        </AuthProvider>
      </NextUIProvider>
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element');
}
