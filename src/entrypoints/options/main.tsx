import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import './style.css';

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  window.document.documentElement.classList.add('dark');
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
