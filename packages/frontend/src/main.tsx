import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';
import { NextUIProvider } from '@nextui-org/react';
import { validateEnv } from './utils/env.ts';

// Validate environment variables
// validateEnv();

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <NextUIProvider>
        <App />
      </NextUIProvider>
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element');
}
