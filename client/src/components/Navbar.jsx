import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, X, LogOut, MessageSquare, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocalized } from '../i18n';
import { services } from '../data/content';
import Icon from './Icon';

export function Logo({ compact = false }) {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="AMS IT Services home">
      <img src="/logo.jpg" alt="AMS IT Services logo" className="h-10 w-10 rounded-xl object-cover shadow-sm ring-1 ring-white" />
      {!compact && (
        <span className="font-display text-[15px] font-extrabold leading-tight tracking-tight text-ink">
          AMS <span className="text-gradient">IT Services</span>
        </span>
      )}
    </Link>
  );
}

export function LanguageToggle({ className = '' }) {
  const { i18n, t } = useTranslation();
  const current = i18n.language?.startsWith('es') ? 'es' : 'en';
  return (
    <div className={`inline-flex rounded-full border border-white bg-white/70 p-0.5 text-xs font-bold shadow-sm ${className}`} role="group" aria-label={t('nav.language')}>
      {['en', 'es'].map((lng) => (
        <button
          key={lng}
          onClick={() => i18n.changeLanguage(lng)}
          aria-pressed={current === lng}
          className={`rounded-full px-2.5 py-1.5 uppercase transition ${current === lng ? 'bg-ink text-white shadow' : 'text-ink-soft hover:text-ink'}`}
        >
          {lng}
        </button>
      ))}
    </div>
  );
}

function ServicesMenu({ onNavigate }) {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const groups = [
    { label: t('nav.coreServices'), items: services.filter((s) => s.core) },
    { label: t('nav.moreServices'), items: services.filter((s) => !s.core) },
  ];
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.4fr_0.9fr]">
      {groups.map((g) => (
        <div key={g.label}>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">{g.label}</p>
          <ul className={g.items.length > 6 ? 'grid sm:grid-cols-2' : ''}>
            {g.items.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`} onClick={onNavigate} className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink-soft transition hover:bg-white hover:text-ink">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-indigo transition group-hover:bg-brand-gradient group-hover:text-white">
                    <Icon name={s.icon} className="h-4 w-4" />
                  </span>
                  <span className="font-medium">{pick(s.title)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Link to="/dockpass" onClick={onNavigate} className="relative hidden overflow-hidden rounded-2xl bg-slate-900 p-5 text-white md:block">
        <img src="/dockpass/gate.webp" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="relative flex h-full flex-col">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide backdrop-blur">
            <Sparkles className="h-3 w-3" /> {t('hero.flagship')}
          </span>
          <img src="/dockpass/logo.webp" alt="DockPass" className="mt-auto w-40" />
          <p className="mt-2 text-sm text-white/85">{t('flagship.subtitle').split('—')[0]}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">{t('flagship.learnMore')} <ArrowRight className="h-4 w-4" /></span>
        </div>
      </Link>
    </div>
  );
}

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const closeTimer = useRef();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setUserOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  const links = [
    { to: '/about', label: t('nav.about') },
    { to: '/projects', label: t('nav.projects') },
    { to: '/portfolio', label: t('nav.portfolio') },
    { to: '/dockpass', label: t('nav.dockpass'), highlight: true },
    { to: '/blog', label: t('nav.blog') },
    { to: '/contact', label: t('nav.contact') },
  ];
  const linkCls = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-white text-ink shadow-sm' : 'text-ink-soft hover:text-ink hover:bg-white/60'}`;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const openMega = () => { clearTimeout(closeTimer.current); setMegaOpen(true); };
  const closeMega = () => { closeTimer.current = setTimeout(() => setMegaOpen(false), 150); };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={`transition-all duration-300 ${scrolled ? 'pt-2' : 'pt-3 sm:pt-4'}`}>
        <div className="container">
          <nav className={`relative flex items-center justify-between gap-3 rounded-2xl px-3 py-2 transition-all duration-300 sm:px-4 ${scrolled ? 'glass-strong shadow-lg' : 'glass'}`}>
            <Logo />

            <div className="hidden items-center gap-0.5 lg:flex">
              <div onMouseEnter={openMega} onMouseLeave={closeMega}>
                <button
                  onClick={() => setMegaOpen((v) => !v)}
                  aria-expanded={megaOpen}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition ${location.pathname.startsWith('/services') ? 'bg-white text-ink shadow-sm' : 'text-ink-soft hover:bg-white/60 hover:text-ink'}`}
                >
                  {t('nav.services')} <ChevronDown className={`h-4 w-4 transition ${megaOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute inset-x-0 top-full pt-3"
                    >
                      <div className="glass-strong rounded-3xl p-5">
                        <ServicesMenu onNavigate={() => setMegaOpen(false)} />
                        <div className="mt-4 flex justify-end border-t border-slate-100 pt-3">
                          <Link to="/services" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-indigo hover:underline">
                            {t('nav.allServices')} <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={linkCls}>
                  {l.highlight ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-gradient" />{l.label}
                    </span>
                  ) : l.label}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <LanguageToggle className="hidden sm:inline-flex" />
              {user ? (
                <div className="relative hidden lg:block">
                  <button onClick={() => setUserOpen((v) => !v)} className="flex items-center gap-2 rounded-full bg-white/80 py-1 pl-1 pr-3 text-sm font-semibold shadow-sm" aria-expanded={userOpen}>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                      {user.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="max-w-[8rem] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="h-4 w-4 text-ink-muted" />
                  </button>
                  <AnimatePresence>
                    {userOpen && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                        className="glass-strong absolute right-0 top-full mt-2 w-56 rounded-2xl p-2">
                        {user.role === 'admin' && (
                          <Link to="/admin" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white"><ShieldCheck className="h-4 w-4" /> {t('nav.admin')}</Link>
                        )}
                        <Link to="/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white"><MessageSquare className="h-4 w-4" /> {t('nav.dashboard')}</Link>
                        <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"><LogOut className="h-4 w-4" /> {t('nav.logout')}</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="btn-ghost hidden lg:inline-flex">{t('nav.login')}</Link>
              )}
              <Link to="/contact" className="btn-primary hidden sm:inline-flex">{t('nav.getQuote')}</Link>
              <button onClick={() => setMobileOpen(true)} className="btn-glass !p-2.5 lg:hidden" aria-label={t('nav.menu')}>
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </nav>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-slate-900/25 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.aside
              className="glass-strong fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto rounded-l-3xl p-5 lg:hidden"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button onClick={() => setMobileOpen(false)} className="btn-ghost !p-2" aria-label="Close menu"><X className="h-6 w-6" /></button>
              </div>
              <nav className="mt-6 flex flex-col gap-1">
                <NavLink to="/" end className={({ isActive }) => `rounded-xl px-4 py-3 font-semibold ${isActive ? 'bg-white shadow-sm' : 'hover:bg-white/70'}`}>{t('nav.home')}</NavLink>
                <details className="group rounded-xl">
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-4 py-3 font-semibold hover:bg-white/70">
                    {t('nav.services')} <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                  </summary>
                  <div className="pb-2 pl-2"><ServicesMenu onNavigate={() => setMobileOpen(false)} /></div>
                </details>
                {links.map((l) => (
                  <NavLink key={l.to} to={l.to} className={({ isActive }) => `rounded-xl px-4 py-3 font-semibold ${isActive ? 'bg-white shadow-sm' : 'hover:bg-white/70'}`}>{l.label}</NavLink>
                ))}
              </nav>
              <div className="mt-auto space-y-3 border-t border-slate-200/60 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-muted">{t('nav.language')}</span>
                  <LanguageToggle />
                </div>
                {user ? (
                  <>
                    {user.role === 'admin' && <Link to="/admin" className="btn-glass w-full">{t('nav.admin')}</Link>}
                    <Link to="/dashboard" className="btn-glass w-full">{t('nav.dashboard')}</Link>
                    <button onClick={handleLogout} className="btn-danger w-full">{t('nav.logout')}</button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/login" className="btn-glass">{t('nav.login')}</Link>
                    <Link to="/register" className="btn-glass">{t('nav.signup')}</Link>
                  </div>
                )}
                <Link to="/contact" className="btn-primary w-full">{t('nav.getQuote')}</Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
