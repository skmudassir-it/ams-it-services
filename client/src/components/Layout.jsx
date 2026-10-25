import { Suspense, useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Gift, X } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatBot from './ChatBot';
import { Spinner } from './ui';

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-brand-violet">
      <Spinner className="h-8 w-8" />
    </div>
  );
}

function PromoBar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(() => {
    try { return sessionStorage.getItem('ams-promo') !== 'closed'; } catch { return true; }
  });
  if (!open) return null;
  const close = () => {
    setOpen(false);
    try { sessionStorage.setItem('ams-promo', 'closed'); } catch {}
  };
  return (
    // Right padding keeps the bar clear of the chat launcher until there is room beside it.
    <div className="fixed inset-x-0 bottom-3 z-40 pl-3 pr-20 sm:bottom-5 sm:pr-24 lg:px-3">
      <div className="glass-strong mx-auto flex max-w-xl items-center gap-3 rounded-full py-2 pl-2 pr-2 text-sm shadow-lg">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white"><Gift className="h-4 w-4" /></span>
        <p className="flex-1 text-xs leading-snug text-ink-soft sm:text-sm">{t('promo')}</p>
        <Link to="/contact" onClick={close} className="btn-primary !px-3 !py-1.5 text-xs">{t('promoCta')}</Link>
        <button onClick={close} className="text-ink-muted hover:text-ink" aria-label="Dismiss"><X className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  // Braces matter: newer browsers return a Promise from scrollTo, which React would treat as a cleanup.
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <PromoBar />
      <ChatBot />
    </div>
  );
}
