import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Eye, EyeOff, MailCheck } from 'lucide-react';
import { Field, Img, Seo, Spinner } from '../components/ui';
import { Logo } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../lib/api';
import { img } from '../lib/images';

function AuthShell({ title, subtitle, children }) {
  const { t } = useTranslation();
  const points = t('auth.sidePoints', { returnObjects: true });
  return (
    <section className="pt-28 pb-16 sm:pt-36">
      <div className="container">
        <div className="glass mx-auto grid max-w-5xl overflow-hidden !rounded-[2rem] lg:grid-cols-2">
          <div className="p-6 sm:p-10">
            <h1 className="!text-3xl sm:!text-4xl">{title}</h1>
            <p className="mt-3 text-ink-soft">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
          <div className="relative hidden min-h-[560px] lg:block">
            <Img src={img('auth.jpg')} alt="" className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-10 text-white">
              <div className="mb-6 inline-block rounded-2xl bg-white/90 p-2"><Logo /></div>
              <h2 className="!text-2xl !text-white">{t('auth.sideTitle')}</h2>
              <ul className="mt-4 space-y-2">
                {points.map((p) => <li key={p} className="flex items-center gap-2 text-sm text-white/90"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> {p}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PasswordInput(props) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={show ? 'text' : 'password'} className="input pr-11" />
      <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink" aria-label={show ? 'Hide password' : 'Show password'}>
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

const destination = (user, from) => {
  if (!user.email_verified) return '/verify-email';
  return from || (user.role === 'admin' ? '/admin' : '/dashboard');
};

export function Login() {
  const { t } = useTranslation();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from;
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={destination(user, from)} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const u = await login(form.email, form.password);
      navigate(destination(u, from), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title={t('auth.loginTitle')} subtitle={t('auth.loginSubtitle')}>
      <Seo title={t('auth.login')} />
      <form onSubmit={submit} className="space-y-4">
        <Field label={t('auth.email')}><input className="input" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label={t('auth.password')}><PasswordInput required autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
        <div className="-mt-1 text-right">
          <Link to="/forgot-password" state={{ email: form.email }} className="text-sm font-semibold text-brand-indigo hover:underline">{t('auth.forgot')}</Link>
        </div>
        {error && <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600" role="alert">{error}</p>}
        <button className="btn-primary btn-lg w-full" disabled={busy}>{busy && <Spinner />} {t('auth.login')}</button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        {t('auth.noAccount')} <Link to="/register" state={{ from }} className="font-semibold text-brand-indigo hover:underline">{t('auth.register')}</Link>
      </p>
    </AuthShell>
  );
}

export function Register() {
  const { t, i18n } = useTranslation();
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from;
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', company: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (user && !busy) return <Navigate to={destination(user, from)} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { emailSent } = await register({ ...form, lang: langOf(i18n) });
      navigate('/verify-email', { replace: true, state: { from, sent: emailSent } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title={t('auth.registerTitle')} subtitle={t('auth.registerSubtitle')}>
      <Seo title={t('auth.register')} />
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label={t('auth.name')} className="sm:col-span-2"><input className="input" required minLength={2} maxLength={80} autoComplete="name" value={form.name} onChange={set('name')} /></Field>
        <Field label={t('auth.email')} className="sm:col-span-2"><input className="input" type="email" required autoComplete="email" value={form.email} onChange={set('email')} /></Field>
        <Field label={t('auth.password')} hint={t('auth.passwordHint')} className="sm:col-span-2"><PasswordInput required minLength={8} autoComplete="new-password" value={form.password} onChange={set('password')} /></Field>
        <Field label={t('auth.phone')}><input className="input" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} /></Field>
        <Field label={t('auth.company')}><input className="input" autoComplete="organization" value={form.company} onChange={set('company')} /></Field>
        {error && <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600 sm:col-span-2" role="alert">{error}</p>}
        <button className="btn-primary btn-lg w-full sm:col-span-2" disabled={busy}>{busy && <Spinner />} {t('auth.register')}</button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        {t('auth.haveAccount')} <Link to="/login" state={{ from }} className="font-semibold text-brand-indigo hover:underline">{t('auth.login')}</Link>
      </p>
    </AuthShell>
  );
}

/* ---------- One-time codes ---------- */

function CodeInput({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <input
      className="input !py-3.5 text-center font-display text-2xl font-bold tracking-[0.6em]"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
      inputMode="numeric"
      autoComplete="one-time-code"
      placeholder="••••••"
      maxLength={6}
      required
      aria-label={t('auth.code')}
    />
  );
}

// Resend button cooldown, matching the server's 60-second limit.
function useCooldown(initial = 0) {
  const [left, setLeft] = useState(initial);
  useEffect(() => {
    if (left <= 0) return undefined;
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);
  return [left, () => setLeft(60)];
}

const langOf = (i18n) => (i18n.language?.startsWith('es') ? 'es' : 'en');

export function VerifyEmail() {
  const { t, i18n } = useTranslation();
  const { user, setUser, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [cooldown, startCooldown] = useCooldown(state?.sent ? 60 : 0);
  const autoSent = useRef(false);

  const resend = async () => {
    setError('');
    try {
      await api.post('/auth/verify/send', { lang: langOf(i18n) });
      startCooldown();
      toast(t('auth.codeSent'));
    } catch (err) {
      setError(err.message);
    }
  };

  // Arriving from sign-in rather than sign-up means no code was sent yet, so send one automatically.
  useEffect(() => {
    if (user && !user.email_verified && !state?.sent && !autoSent.current) {
      autoSent.current = true;
      resend();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.email_verified) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { user: u } = await api.post('/auth/verify', { code });
      setUser(u);
      toast(t('auth.verified'));
      navigate(state?.from || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title={t('auth.verifyTitle')} subtitle={t('auth.verifySubtitle')}>
      <Seo title={t('auth.verifyTitle')} />
      <div className="mb-6 flex items-center gap-3 rounded-2xl bg-brand-50 p-4 text-sm">
        <MailCheck className="h-6 w-6 shrink-0 text-brand-violet" />
        <p>{t('auth.codeSentTo')} <b className="break-all">{user.email}</b></p>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <Field label={t('auth.code')}><CodeInput value={code} onChange={setCode} /></Field>
        {error && <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600" role="alert">{error}</p>}
        <button className="btn-primary btn-lg w-full" disabled={busy || code.length !== 6}>{busy && <Spinner />} {t('auth.verify')}</button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        {t('auth.noCode')}{' '}
        <button onClick={resend} disabled={cooldown > 0} className="font-semibold text-brand-indigo hover:underline disabled:text-ink-muted disabled:no-underline">
          {cooldown > 0 ? t('auth.resendIn', { s: cooldown }) : t('auth.resend')}
        </button>
      </p>
    </AuthShell>
  );
}

export function ForgotPassword() {
  const { t, i18n } = useTranslation();
  const { setUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [step, setStep] = useState('email');
  const [form, setForm] = useState({ email: state?.email || '', code: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [cooldown, startCooldown] = useCooldown();

  const requestCode = async (e) => {
    e?.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/auth/password/forgot', { email: form.email, lang: langOf(i18n) });
      startCooldown();
      setStep('reset');
      toast(t('auth.codeSent'));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { user } = await api.post('/auth/password/reset', form);
      setUser(user);
      toast(t('auth.passwordChanged'));
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title={t('auth.forgotTitle')} subtitle={step === 'email' ? t('auth.forgotSubtitle') : t('auth.resetSubtitle')}>
      <Seo title={t('auth.forgotTitle')} />
      {step === 'email' ? (
        <form onSubmit={requestCode} className="space-y-4">
          <Field label={t('auth.email')}><input className="input" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          {error && <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600" role="alert">{error}</p>}
          <button className="btn-primary btn-lg w-full" disabled={busy}>{busy && <Spinner />} {t('auth.sendCode')}</button>
        </form>
      ) : (
        <form onSubmit={reset} className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-brand-50 p-4 text-sm">
            <MailCheck className="h-6 w-6 shrink-0 text-brand-violet" />
            <p>{t('auth.resetSentTo')} <b className="break-all">{form.email}</b></p>
          </div>
          <Field label={t('auth.code')}><CodeInput value={form.code} onChange={(code) => setForm({ ...form, code })} /></Field>
          <Field label={t('auth.newPassword')} hint={t('auth.passwordHint')}>
            <PasswordInput required minLength={8} autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </Field>
          {error && <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600" role="alert">{error}</p>}
          <button className="btn-primary btn-lg w-full" disabled={busy || form.code.length !== 6}>{busy && <Spinner />} {t('auth.resetPassword')}</button>
          <p className="text-center text-sm text-ink-soft">
            {t('auth.noCode')}{' '}
            <button type="button" onClick={requestCode} disabled={cooldown > 0} className="font-semibold text-brand-indigo hover:underline disabled:text-ink-muted disabled:no-underline">
              {cooldown > 0 ? t('auth.resendIn', { s: cooldown }) : t('auth.resend')}
            </button>
          </p>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-ink-soft">
        <Link to="/login" className="font-semibold text-brand-indigo hover:underline">{t('auth.backToLogin')}</Link>
      </p>
    </AuthShell>
  );
}
