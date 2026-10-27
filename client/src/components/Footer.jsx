import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { useLocalized } from '../i18n';
import { company, services } from '../data/content';
import { Logo } from './Navbar';
import { Spinner } from './ui';

export function NewsletterForm({ className = '' }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/subscribe', { email });
      setEmail('');
      toast(t('footer.subscribed'));
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className={`flex gap-2 ${className}`}>
      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('footer.emailPlaceholder')} className="input min-w-0 flex-1 !rounded-full" aria-label="Email" />
      <button className="btn-primary !px-4" disabled={busy} aria-label={t('footer.subscribe')}>
        {busy ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        <span className="hidden sm:inline">{t('footer.subscribe')}</span>
      </button>
    </form>
  );
}

export default function Footer() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const year = new Date().getFullYear();

  const companyLinks = [
    ['/about', t('nav.about')], ['/projects', t('nav.projects')], ['/portfolio', t('nav.portfolio')],
    ['/amserp', 'AMS ERP'], ['/dockpass', 'DockPass'], ['/blog', t('nav.blog')], ['/contact', t('nav.contact')],
  ];

  return (
    <footer className="relative mt-10 pb-6">
      <div className="container">
        <div className="glass rounded-[2rem] p-6 sm:p-10">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1.2fr_1.3fr]">
            <div>
              <Logo />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">{t('footer.about')}</p>
              <ul className="mt-5 space-y-2.5 text-sm">
                <li><a href={`mailto:${company.email}`} className="flex items-center gap-2 text-ink-soft hover:text-ink"><Mail className="h-4 w-4 text-brand-violet" />{company.email}</a></li>
                <li><a href={company.phoneHref} className="flex items-center gap-2 text-ink-soft hover:text-ink"><Phone className="h-4 w-4 text-brand-violet" />{company.phone}</a></li>
                {company.offices.map((o) => (
                  <li key={o.key} className="flex items-center gap-2 text-ink-soft"><MapPin className="h-4 w-4 text-brand-violet" />{o.city}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-ink-muted">{t('footer.company')}</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {companyLinks.map(([to, label]) => (
                  <li key={to}><Link to={to} className="text-ink-soft hover:text-ink">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-ink-muted">{t('footer.services')}</h4>
              <ul className="mt-4 grid grid-cols-1 gap-2.5 text-sm">
                {services.slice(0, 8).map((s) => (
                  <li key={s.slug}><Link to={`/services/${s.slug}`} className="text-ink-soft hover:text-ink">{pick(s.title)}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-ink-muted">{t('footer.newsletter')}</h4>
              <p className="mt-4 text-sm text-ink-soft">{t('footer.newsletterText')}</p>
              <NewsletterForm className="mt-4" />
              <Link to="/amserp" className="mt-6 flex items-center gap-3 rounded-2xl bg-white/70 p-3 transition hover:bg-white">
                <img src="/amserp/logo.svg" alt="" className="h-9 w-9" />
                <span>
                  <span className="block font-display text-sm font-extrabold">AMS ERP</span>
                  <span className="block text-xs text-ink-soft">{t('erp.eyebrow')}</span>
                </span>
              </Link>
              <a href="https://dockpass.org" target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-3 rounded-2xl bg-white/70 p-3 transition hover:bg-white">
                <img src="/dockpass/logo.webp" alt="DockPass" className="h-8 w-auto" />
                <span className="text-xs text-ink-soft">{t('flagship.built')}</span>
              </a>
            </div>
          </div>
          <div className="mt-10 flex justify-center border-t border-slate-200/60 pt-6 text-xs text-ink-muted">
            <p>© {year} AMS IT Services. {t('footer.rights')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
