import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import App from './App.jsx';
import './assets/styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            },
            success: {
              iconTheme: {
                primary: 'var(--color-primary-600)',
                secondary: '#fff',
              },
            },
          }}
        />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
