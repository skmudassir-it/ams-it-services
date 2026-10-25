import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Inbox, Lock, Trash2, Unlock } from 'lucide-react';
import { Skeleton, Spinner } from '../../components/ui';
import { ChatComposer, ChatMessages } from '../../components/Chat';
import { api, formatDate } from '../../lib/api';
import { useDebounced, useFetch } from '../../lib/useFetch';
import { useLocalized } from '../../i18n';
import { useToast } from '../../context/ToastContext';
import { AdminHeader, SearchBox } from './AdminLayout';

export default function Messages() {
  const { t } = useTranslation();
  const { lang } = useLocalized();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const activeId = params.get('thread');
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const dq = useDebounced(q);
  const list = useFetch(`/admin/threads?status=${status}&q=${encodeURIComponent(dq)}`);
  const thread = useFetch(activeId ? `/admin/threads/${activeId}` : null);
  const { reload: reloadList } = list;
  const { reload: reloadThread } = thread;

  useEffect(() => {
    const id = setInterval(() => { reloadList(); if (activeId) reloadThread(); }, 15000);
    return () => clearInterval(id);
  }, [activeId, reloadList, reloadThread]);

  // Opening a thread marks it read, so refresh the unread badges.
  useEffect(() => { if (thread.data) reloadList(); }, [thread.data?.thread.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const select = (id) => setParams(id ? { thread: String(id) } : {});
  const send = async (body) => {
    await api.post(`/admin/threads/${activeId}/messages`, { body });
    await Promise.all([thread.reload(), list.reload()]);
  };
  const toggleStatus = async () => {
    const next = thread.data.thread.status === 'open' ? 'closed' : 'open';
    await api.patch(`/admin/threads/${activeId}`, { status: next });
    await Promise.all([thread.reload(), list.reload()]);
  };
  const remove = async () => {
    if (!window.confirm(t('common.confirmDelete'))) return;
    try {
      await api.del(`/admin/threads/${activeId}`);
      select(null);
      list.reload();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const threads = list.data?.threads || [];
  const th = thread.data?.thread;
  const labels = { user: th?.name || 'User', admin: 'AMS IT Services' };

  return (
    <>
      <AdminHeader title={t('admin.messages')}>
        <SearchBox value={q} onChange={setQ} placeholder={t('common.search')} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input !w-auto !rounded-full" aria-label="Status">
          <option value="">{t('admin.all')}</option>
          <option value="open">{t('dashboard.open')}</option>
          <option value="closed">{t('dashboard.closed')}</option>
        </select>
      </AdminHeader>

      <div className="glass grid h-[calc(100vh-12rem)] min-h-[520px] overflow-hidden !rounded-[1.5rem] md:grid-cols-[340px_1fr]">
        <aside className={`flex-col overflow-hidden border-white/80 md:flex md:border-r ${activeId ? 'hidden' : 'flex'}`}>
          <div className="flex-1 overflow-y-auto p-2">
            {list.loading && !list.data && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="m-2 h-16" />)}
            {list.data && threads.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-sm text-ink-muted"><Inbox className="mb-2 h-8 w-8" />{t('admin.noData')}</div>
            )}
            {threads.map((x) => (
              <button key={x.id} onClick={() => select(x.id)}
                className={`mb-1 w-full rounded-2xl px-4 py-3 text-left transition ${String(x.id) === activeId ? 'bg-white shadow-sm' : 'hover:bg-white/60'}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className={`truncate text-sm ${x.unread ? 'font-bold' : 'font-semibold'}`}>{x.name}</p>
                  {x.unread > 0 && <span className="badge bg-brand-gradient text-white">{x.unread}</span>}
                </div>
                <p className="truncate text-xs font-medium">{x.subject}</p>
                <p className="mt-0.5 truncate text-xs text-ink-soft">{x.last_message}</p>
                <p className="mt-1 text-[11px] text-ink-muted">{formatDate(x.updated_at, lang, true)}{x.status === 'closed' ? ` · ${t('dashboard.closed')}` : ''}</p>
              </button>
            ))}
          </div>
        </aside>

        <div className={`flex-col overflow-hidden md:flex ${activeId ? 'flex' : 'hidden'}`}>
          {!activeId ? (
            <div className="flex flex-1 items-center justify-center text-sm text-ink-muted">{t('dashboard.select')}</div>
          ) : !th ? (
            <div className="flex flex-1 items-center justify-center"><Spinner className="text-brand-violet" /></div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3 border-b border-white/80 bg-white/40 px-4 py-3">
                <button onClick={() => select(null)} className="btn-ghost !p-2 md:hidden" aria-label={t('dashboard.back')}><ArrowLeft className="h-5 w-5" /></button>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{th.subject}</p>
                  <p className="truncate text-xs text-ink-muted">
                    {th.name} · <a href={`mailto:${th.email}`} className="hover:underline">{th.email}</a>
                    {th.phone ? ` · ${th.phone}` : ''}{th.company ? ` · ${th.company}` : ''}
                  </p>
                </div>
                <button onClick={toggleStatus} className="btn-glass !px-3 !py-2 text-xs">
                  {th.status === 'open' ? <><Lock className="h-3.5 w-3.5" /> {t('admin.close')}</> : <><Unlock className="h-3.5 w-3.5" /> {t('admin.reopen')}</>}
                </button>
                <button onClick={remove} className="btn-danger !px-3 !py-2 text-xs" aria-label={t('common.delete')}><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <ChatMessages messages={thread.data.messages} mine="admin" labels={labels} />
              <ChatComposer onSend={send} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
