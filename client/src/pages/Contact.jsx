import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CalendarClock, CheckCircle2, Clock, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';
import { Field, Img, PageHero, Reveal, Seo, Spinner } from '../components/ui';
import { company } from '../data/content';
import { api } from '../lib/api';
import { img } from '../lib/images';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const empty = { name: '', email: '', phone: '', message: '', date: '', time: '' };

export default function Contact() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const toast = useToast();
  const [type, setType] = useState('quote');
  const [form, setForm] = useState({ ...empty, name: user?.name || '', email: user?.email || '' });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/contact', { type, ...form });
      setSent(true);
      setForm(empty);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const details = [
    { icon: Phone, title: t('contactPage.callUs'), value: company.phone, note: t('contactPage.callNote'), href: company.phoneHref },
    { icon: Mail, title: t('contactPage.emailUs'), value: company.email, note: t('contactPage.emailNote'), href: `mailto:${company.email}` },
    { icon: MapPin, title: t('about.usa'), value: 'Memphis, Tennessee, USA', note: t('about.india') + ': Hyderabad, India' },
    { icon: Clock, title: t('contactPage.hours'), value: t('contactPage.hoursText') },
  ];

  return (
    <>
      <Seo title={t('nav.contact')} description={t('contactPage.subtitle')} />
      <PageHero eyebrow={t('nav.contact')} title={t('contactPage.title')} subtitle={t('contactPage.subtitle')} image={img('contact.jpg')} />

      <section className="pb-20">
        <div className="container grid gap-8 lg:grid-cols-[1fr_1.35fr]">
          <div className="space-y-4">
            {details.map((d) => {
              const Content = (
                <div className="glass card-hover flex items-start gap-4 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white"><d.icon className="h-5 w-5" /></span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{d.title}</p>
                    <p className="mt-0.5 break-words font-semibold">{d.value}</p>
                    {d.note && <p className="mt-0.5 text-sm text-ink-soft">{d.note}</p>}
                  </div>
                </div>
              );
              return <Reveal key={d.title}>{d.href ? <a href={d.href} className="block">{Content}</a> : Content}</Reveal>;
            })}
            <Reveal>
              <div className="glass overflow-hidden p-6">
                <MessageSquare className="h-6 w-6 text-brand-violet" />
                <h3 className="mt-3">{t('contactPage.accountTitle')}</h3>
                <p className="mt-2 text-sm text-ink-soft">{t('contactPage.accountText')}</p>
                {user
                  ? <Link to="/dashboard" className="btn-primary mt-4">{t('contactPage.accountOpen')}</Link>
                  : <div className="mt-4 flex flex-wrap gap-2"><Link to="/register" className="btn-primary">{t('contactPage.accountCta')}</Link><Link to="/login" className="btn-glass">{t('nav.login')}</Link></div>}
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="glass p-5 sm:p-8">
              {sent ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500"><CheckCircle2 className="h-8 w-8" /></span>
                  <p className="mt-5 max-w-md text-lg font-semibold">{t('contactPage.success')}</p>
                  <button onClick={() => setSent(false)} className="btn-glass mt-6">{t('contactPage.tabQuote')}</button>
                </div>
              ) : (
                <>
                  <div className="inline-flex w-full rounded-full bg-white/70 p-1 sm:w-auto" role="tablist">
                    {[['quote', t('contactPage.tabQuote'), Send], ['call', t('contactPage.tabCall'), CalendarClock]].map(([key, label, TIcon]) => (
                      <button key={key} role="tab" aria-selected={type === key} onClick={() => setType(key)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition sm:flex-none ${type === key ? 'bg-ink text-white shadow' : 'text-ink-soft hover:text-ink'}`}>
                        <TIcon className="h-4 w-4" /> {label}
                      </button>
                    ))}
                  </div>
                  <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field label={`${t('contactPage.name')} *`}><input className="input" required minLength={2} value={form.name} onChange={set('name')} autoComplete="name" /></Field>
                    <Field label={`${t('contactPage.email')} *`}><input className="input" type="email" required value={form.email} onChange={set('email')} autoComplete="email" /></Field>
                    <Field label={`${t('contactPage.phone')}${type === 'call' ? ' *' : ''}`} className={type === 'quote' ? 'sm:col-span-2' : ''}>
                      <input className="input" type="tel" required={type === 'call'} value={form.phone} onChange={set('phone')} autoComplete="tel" />
                    </Field>
                    {type === 'call' && (
                      <div className="grid grid-cols-2 gap-4">
                        <Field label={`${t('contactPage.date')} *`}><input className="input" type="date" required value={form.date} onChange={set('date')} min={new Date().toISOString().slice(0, 10)} /></Field>
                        <Field label={`${t('contactPage.time')} *`}><input className="input" type="time" required value={form.time} onChange={set('time')} /></Field>
                      </div>
                    )}
                    <Field label={type === 'call' ? t('contactPage.topic') : `${t('contactPage.message')} *`} className="sm:col-span-2">
                      <textarea className="input min-h-[150px] resize-y" required={type === 'quote'} value={form.message} onChange={set('message')} placeholder={t('contactPage.messagePlaceholder')} maxLength={5000} />
                    </Field>
                    <div className="sm:col-span-2">
                      <button className="btn-primary btn-lg w-full sm:w-auto" disabled={busy}>
                        {busy ? <Spinner /> : type === 'call' ? <CalendarClock className="h-5 w-5" /> : <Send className="h-5 w-5" />}
                        {type === 'call' ? t('contactPage.bookCall') : t('contactPage.sendQuote')}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
            <div className="mt-6 hidden overflow-hidden rounded-[2rem] border-[6px] border-white shadow-lift lg:block">
              <Img src={img('offices.jpg')} alt="Memphis and Hyderabad" className="aspect-[21/8]" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
