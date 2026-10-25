import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MotionConfig } from 'framer-motion';
import './i18n';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { PageLoader } from './components/Layout';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <MotionConfig reducedMotion="user">
          <AuthProvider>
            <ToastProvider>
              <Suspense fallback={<PageLoader />}>
                <App />
              </Suspense>
            </ToastProvider>
          </AuthProvider>
        </MotionConfig>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
