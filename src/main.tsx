// src/main.tsx
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { AuthProvider } from './app/contexts/AuthContext';
import { NotificationProvider } from './app/contexts/NotificationContext';
import { ThemeProvider } from './app/contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <AuthProvider>
      <NotificationProvider>
        <App />
        <Toaster position="top-right" />
      </NotificationProvider>
    </AuthProvider>
  </ThemeProvider>
);