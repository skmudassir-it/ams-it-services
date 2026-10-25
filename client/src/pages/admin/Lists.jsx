import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, CheckCircle2, Copy, Download, Trash2 } from 'lucide-react';
import { Skeleton } from '../../components/ui';
import { api, formatDate } from '../../lib/api';
import { useDebounced, useFetch } from '../../lib/useFetch';
import { useLocalized } from '../../i18n';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { AdminHeader, DataTable, SearchBox } from './AdminLayout';

function useSearchList(base) {
  const [q, setQ] = useState('');
  const dq = useDebounced(q);
  const res = useFetch(`${base}?q=${encodeURIComponent(dq)}`);
  return { q, setQ, ...res };
}

function useRemove(reload) {
  const { t } = useTranslation();
  const toast = useToast();
  return async (url) => {
    if (!window.confirm(t('common.confirmDelete'))) return;
    try {
      await api.del(url);
      reload();
    } catch (e) {
      toast(e.message, 'error');
    }
  };
}

function CopyEmails({ emails }) {
  const { t } = useTranslation();
  const toast = useToast();
  if (!emails.length) return null;
  return (
    <button
      className="btn-glass"
      onClick={() => navigator.clipboard.writeText(emails.join(', ')).then(() => toast(`${emails.length} ✓`))}
    >
      <Copy className="h-4 w-4" /> {t('admin.email')} ({emails.length})
    </button>
  );
}

export function UsersPage() {
  const { t } = useTranslation();
  const { lang } = useLocalized();
  const { user: me } = useAuth();
  const { q, setQ, data, loading, reload } = useSearchList('/admin/users');
  const remove = useRemove(reload);
  const users = data?.users || [];

  return (
    <>
      <AdminHeader title={t('admin.users')}>
        <SearchBox value={q} onChange={setQ} placeholder={t('common.search')} />
        <CopyEmails emails={users.map((u) => u.email)} />
        <a href="/api/admin/users.csv" className="btn-primary"><Download className="h-4 w-4" /> {t('admin.exportCsv')}</a>
      </AdminHeader>
      {loading && !data ? <Skeleton className="h-64" /> : (
        <DataTable
          empty={t('admin.noData')}
          rows={users}
          columns={[
            {
              key: 'name', label: t('admin.name'),
              render: (u) => (
                <span className="inline-flex flex-wrap items-center justify-end gap-1.5 md:justify-start">
                  <span className="font-semibold">{u.name}</span>
                  <span className={`badge ${u.email_verified_at ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {u.email_verified_at ? t('admin.verified') : t('admin.unverified')}
                  </span>
                </span>
              ),
            },
            { key: 'email', label: t('admin.email'), render: (u) => <a href={`mailto:${u.email}`} className="text-brand-indigo hover:underline">{u.email}</a> },
            { key: 'phone', label: t('admin.phone'), render: (u) => u.phone || '—' },
            { key: 'company', label: t('admin.company'), render: (u) => u.company || '—' },
            { key: 'role', label: t('admin.role'), render: (u) => <span className={`badge ${u.role === 'admin' ? 'bg-brand-gradient text-white' : 'bg-slate-100 text-ink-soft'}`}>{u.role}</span> },
            { key: 'threads', label: t('admin.conversations') },
            { key: 'created_at', label: t('admin.joined'), render: (u) => formatDate(u.created_at, lang) },
            { key: 'last_login_at', label: t('admin.lastLogin'), render: (u) => formatDate(u.last_login_at, lang, true) || '—' },
            {
              key: 'actions', label: '', className: 'text-right',
              render: (u) => u.id !== me.id && (
                <button onClick={() => remove(`/admin/users/${u.id}`)} className="btn-danger !p-2" aria-label={t('common.delete')}><Trash2 className="h-4 w-4" /></button>
              ),
            },
          ]}
        />
      )}
    </>
  );
}

export function SubscribersPage() {
  const { t } = useTranslation();
  const { lang } = useLocalized();
  const { q, setQ, data, loading, reload } = useSearchList('/admin/subscribers');
  const remove = useRemove(reload);
  const subs = data?.subscribers || [];

  return (
    <>
      <AdminHeader title={t('admin.subscribers')}>
        <SearchBox value={q} onChange={setQ} placeholder={t('common.search')} />
        <CopyEmails emails={subs.map((s) => s.email)} />
        <a href="/api/admin/subscribers.csv" className="btn-primary"><Download className="h-4 w-4" /> {t('admin.exportCsv')}</a>
      </AdminHeader>
      {loading && !data ? <Skeleton className="h-64" /> : (
        <DataTable
          empty={t('admin.noData')}
          rows={subs}
          columns={[
            { key: 'email', label: t('admin.email'), render: (s) => <a href={`mailto:${s.email}`} className="font-semibold text-brand-indigo hover:underline">{s.email}</a> },
            { key: 'created_at', label: t('admin.subscribed'), render: (s) => formatDate(s.created_at, lang, true) },
            {
              key: 'actions', label: '', className: 'text-right',
              render: (s) => <button onClick={() => remove(`/admin/subscribers/${s.id}`)} className="btn-danger !p-2" aria-label={t('common.delete')}><Trash2 className="h-4 w-4" /></button>,
            },
          ]}
        />
      )}
    </>
  );
}

export function RequestsPage() {
  const { t } = useTranslation();
  const { lang } = useLocalized();
  const toast = useToast();
  const { q, setQ, data, loading, reload } = useSearchList('/admin/requests');
  const remove = useRemove(reload);

  const toggle = async (r) => {
    try {
      await api.patch(`/admin/requests/${r.id}`, { handled: !r.handled });
      reload();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  return (
    <>
      <AdminHeader title={t('admin.requests')}>
        <SearchBox value={q} onChange={setQ} placeholder={t('common.search')} />
      </AdminHeader>
      {loading && !data ? <Skeleton className="h-64" /> : (
        <DataTable
          empty={t('admin.noData')}
          rows={data?.requests || []}
          columns={[
            {
              key: 'type', label: t('admin.type'),
              render: (r) => <span className={`badge ${r.type === 'call' ? 'bg-sky-50 text-sky-700' : 'bg-brand-50 text-brand-indigo'}`}>{r.type === 'call' ? t('contactPage.tabCall') : t('contactPage.tabQuote')}</span>,
            },
            {
              key: 'name', label: t('admin.name'),
              render: (r) => (
                <div className="text-right md:text-left">
                  <p className="font-semibold">{r.name}</p>
                  <a href={`mailto:${r.email}`} className="text-xs text-brand-indigo hover:underline">{r.email}</a>
                  {r.phone && <p className="text-xs text-ink-muted">{r.phone}</p>}
                </div>
              ),
            },
            {
              key: 'message', label: t('contactPage.message'), className: 'md:max-w-md',
              render: (r) => (
                <div className="text-right md:text-left">
                  {r.type === 'call' && <p className="text-xs font-semibold text-sky-700">{r.date} · {r.time}</p>}
                  <p className="whitespace-pre-wrap text-ink-soft">{r.message || '—'}</p>
                </div>
              ),
            },
            { key: 'created_at', label: t('admin.received'), render: (r) => formatDate(r.created_at, lang, true) },
            {
              key: 'actions', label: '', className: 'text-right',
              render: (r) => (
                <div className="flex justify-end gap-2">
                  <button onClick={() => toggle(r)} className={`btn !px-3 !py-1.5 text-xs ${r.handled ? 'bg-emerald-50 text-emerald-700' : 'btn-glass'}`}>
                    {r.handled ? <><CheckCircle2 className="h-3.5 w-3.5" /> {t('admin.handled')}</> : <><Check className="h-3.5 w-3.5" /> {t('admin.markHandled')}</>}
                  </button>
                  <button onClick={() => remove(`/admin/requests/${r.id}`)} className="btn-danger !p-2" aria-label={t('common.delete')}><Trash2 className="h-4 w-4" /></button>
                </div>
              ),
            },
          ]}
        />
      )}
    </>
  );
}
