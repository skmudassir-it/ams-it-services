import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, BookOpen, CheckCircle2, FolderKanban, Inbox, Mail, MailCheck, MessagesSquare, Send, Users } from 'lucide-react';
import { Skeleton, Spinner } from '../../components/ui';
import { api, formatDate } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useFetch } from '../../lib/useFetch';
import { useLocalized } from '../../i18n';
import { AdminHeader } from './AdminLayout';

// SMTP health: connection check against the configured server plus a test-email sender.
function EmailStatus() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const toast = useToast();
  const { data, loading, reload } = useFetch('/admin/email/status');
  const [to, setTo] = useState(user.email);
  const [busy, setBusy] = useState(false);

  const sendTest = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/admin/email/test', { to });
      toast(t('admin.testSent', { to }));
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const tone = !data ? 'text-ink-muted' : data.ok ? 'text-emerald-600' : 'text-amber-600';
  return (
    <div className="glass mt-8 !rounded-2xl p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <MailCheck className="mt-0.5 h-5 w-5 text-brand-violet" />
          <div>
            <h2 className="!text-lg">{t('admin.emailTitle')}</h2>
            {loading && !data ? <Spinner className="mt-1 h-4 w-4 text-ink-muted" /> : (
              <p className={`mt-1 flex items-center gap-1.5 text-sm font-semibold ${tone}`}>
                {data?.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                {data?.ok ? t('admin.emailOk') : data?.configured ? t('admin.emailError') : t('admin.emailOff')}
              </p>
            )}
            {data?.configured && (
              <p className="mt-1 break-all text-xs text-ink-muted">{data.host}:{data.port} · {data.from} → {t('admin.notifies')} {data.adminTo}</p>
            )}
            {data && !data.ok && data.error && <p className="mt-1 break-all text-xs text-rose-600">{data.error}</p>}
          </div>
        </div>
        <form onSubmit={sendTest} className="flex flex-col gap-2 sm:flex-row">
          <input type="email" required value={to} onChange={(e) => setTo(e.target.value)} className="input !rounded-full sm:!w-64" aria-label={t('admin.email')} />
          <button className="btn-primary" disabled={busy || !data?.configured}>{busy ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />} {t('admin.sendTest')}</button>
          <button type="button" onClick={reload} className="btn-glass">{t('admin.recheck')}</button>
        </form>
      </div>
    </div>
  );
}

export default function Overview() {
  const { t } = useTranslation();
  const { lang } = useLocalized();
  const { data } = useFetch('/admin/stats');

  const cards = [
    ['users', t('admin.statUsers'), Users, '/admin/users'],
    ['unread', t('admin.statUnread'), MessagesSquare, '/admin/messages'],
    ['requests', t('admin.statRequests'), Inbox, '/admin/requests'],
    ['subscribers', t('admin.statSubscribers'), Mail, '/admin/subscribers'],
    ['projects', t('admin.statProjects'), FolderKanban, '/admin/projects'],
    ['posts', t('admin.statPosts'), BookOpen, '/admin/posts'],
  ];

  return (
    <>
      <AdminHeader title={t('admin.overview')} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map(([key, label, IconCmp, to]) => (
          <Link key={key} to={to} className="glass card-hover !rounded-2xl p-5">
            <IconCmp className="h-5 w-5 text-brand-violet" />
            <p className="mt-3 font-display text-3xl font-extrabold">{data ? data[key] : '–'}</p>
            <p className="mt-1 text-xs font-medium text-ink-soft">{label}</p>
          </Link>
        ))}
      </div>

      <EmailStatus />

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="glass !rounded-2xl p-5">
          <h2 className="!text-lg">{t('admin.recentThreads')}</h2>
          <ul className="mt-4 divide-y divide-white">
            {!data && <Skeleton className="h-24" />}
            {data?.recentThreads.length === 0 && <li className="py-6 text-sm text-ink-muted">{t('admin.noData')}</li>}
            {data?.recentThreads.map((th) => (
              <li key={th.id}>
                <Link to={`/admin/messages?thread=${th.id}`} className="flex items-center justify-between gap-3 py-3 hover:opacity-80">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{th.subject}</p>
                    <p className="text-xs text-ink-muted">{th.name} · {formatDate(th.updated_at, lang, true)}</p>
                  </div>
                  {th.unread > 0 && <span className="badge bg-brand-gradient text-white">{th.unread}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass !rounded-2xl p-5">
          <h2 className="!text-lg">{t('admin.recentUsers')}</h2>
          <ul className="mt-4 divide-y divide-white">
            {!data && <Skeleton className="h-24" />}
            {data?.recentUsers.length === 0 && <li className="py-6 text-sm text-ink-muted">{t('admin.noData')}</li>}
            {data?.recentUsers.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{u.name}</p>
                  <p className="truncate text-xs text-ink-muted">{u.email}</p>
                </div>
                <span className="shrink-0 text-xs text-ink-muted">{formatDate(u.created_at, lang)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
