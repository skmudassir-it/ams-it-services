import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Inbox, Plus, UserCog } from 'lucide-react';
import { Field, Modal, Seo, Skeleton, Spinner } from '../components/ui';
import { ChatComposer, ChatMessages } from '../components/Chat';
import { api, formatDate } from '../lib/api';
import { useFetch } from '../lib/useFetch';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLocalized } from '../i18n';

function NewThreadModal({ open, onClose, onCreated }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [form, setForm] = useState({ subject: '', body: '' });
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { id } = await api.post('/threads', form);
      setForm({ subject: '', body: '' });
      onCreated(id);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal open={open} onClose={onClose} title={t('dashboard.new')}>
      <form onSubmit={submit} className="space-y-4">
        <Field label={t('dashboard.subject')}><input className="input" required minLength={2} maxLength={160} value={form.subject} placeholder={t('dashboard.subjectPlaceholder')} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></Field>
        <Field label={t('dashboard.message')}><textarea className="input min-h-[160px]" required maxLength={5000} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></Field>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-ghost">{t('common.cancel')}</button>
          <button className="btn-primary" disabled={busy}>{busy && <Spinner className="h-4 w-4" />} {t('dashboard.send')}</button>
        </div>
      </form>
    </Modal>
  );
}

function ProfileModal({ open, onClose }) {
  const { t } = useTranslation();
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', company: user.company || '' });
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { user: u } = await api.put('/auth/me', form);
      setUser(u);
      toast(t('dashboard.saved'));
      onClose();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal open={open} onClose={onClose} title={t('dashboard.profile')}>
      <form onSubmit={submit} className="space-y-4">
        <Field label={t('auth.email')}><input className="input opacity-70" value={user.email} disabled /></Field>
        <Field label={t('auth.name')}><input className="input" required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label={t('auth.phone')}><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        <Field label={t('auth.company')}><input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
        <div className="flex justify-end"><button className="btn-primary" disabled={busy}>{busy && <Spinner className="h-4 w-4" />} {t('dashboard.saveProfile')}</button></div>
      </form>
    </Modal>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { lang } = useLocalized();
  const { user } = useAuth();
  const list = useFetch('/threads');
  const [activeId, setActiveId] = useState(null);
  const thread = useFetch(activeId ? `/threads/${activeId}` : null);
  const [newOpen, setNewOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { reload: reloadList } = list;
  const { reload: reloadThread } = thread;

  // Light polling so replies from the team show up without a refresh.
  useEffect(() => {
    const id = setInterval(() => { reloadList(); if (activeId) reloadThread(); }, 15000);
    return () => clearInterval(id);
  }, [activeId, reloadList, reloadThread]);

  const send = async (body) => {
    await api.post(`/threads/${activeId}/messages`, { body });
    await Promise.all([thread.reload(), list.reload()]);
  };

  const threads = list.data?.threads || [];
  const labels = { user: t('dashboard.you'), admin: t('dashboard.team') };

  return (
    <section className="pt-28 pb-16 sm:pt-32">
      <Seo title={t('dashboard.title')} />
      <div className="container">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-brand-indigo">{t('dashboard.hello', { name: user.name.split(' ')[0] })}</p>
            <h1 className="mt-1 !text-3xl sm:!text-4xl">{t('dashboard.title')}</h1>
            <p className="mt-2 text-ink-soft">{t('dashboard.subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setProfileOpen(true)} className="btn-glass"><UserCog className="h-4 w-4" /> {t('dashboard.profile')}</button>
            <button onClick={() => setNewOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> {t('dashboard.new')}</button>
          </div>
        </div>

        <div className="glass mt-8 grid h-[calc(100vh-15rem)] min-h-[520px] overflow-hidden !rounded-[2rem] md:grid-cols-[320px_1fr]">
          <aside className={`flex flex-col overflow-hidden border-white/80 md:border-r ${activeId ? 'hidden md:flex' : 'flex'}`}>
            <div className="flex-1 overflow-y-auto p-2">
              {list.loading && !list.data && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="m-2 h-16" />)}
              {list.data && threads.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center text-sm text-ink-soft">
                  <Inbox className="mb-3 h-10 w-10 text-brand-violet/60" />
                  {t('dashboard.empty')}
                  <button onClick={() => setNewOpen(true)} className="btn-primary mt-4"><Plus className="h-4 w-4" /> {t('dashboard.new')}</button>
                </div>
              )}
              {threads.map((th) => (
                <button key={th.id} onClick={() => setActiveId(th.id)}
                  className={`mb-1 w-full rounded-2xl px-4 py-3 text-left transition ${activeId === th.id ? 'bg-white shadow-sm' : 'hover:bg-white/60'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{th.subject}</p>
                    {th.unread > 0 && <span className="badge bg-brand-gradient text-white">{th.unread}</span>}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ink-soft">{th.last_message}</p>
                  <p className="mt-1 text-[11px] text-ink-muted">{formatDate(th.updated_at, lang, true)} · {th.status === 'closed' ? t('dashboard.closed') : t('dashboard.open')}</p>
                </button>
              ))}
            </div>
          </aside>

          <div className={`flex flex-col overflow-hidden ${activeId ? 'flex' : 'hidden md:flex'}`}>
            {!activeId ? (
              <div className="flex flex-1 items-center justify-center p-6 text-sm text-ink-muted">{t('dashboard.select')}</div>
            ) : (
              <>
                <div className="flex items-center gap-3 border-b border-white/80 bg-white/40 px-4 py-3">
                  <button onClick={() => setActiveId(null)} className="btn-ghost !p-2 md:hidden" aria-label={t('dashboard.back')}><ArrowLeft className="h-5 w-5" /></button>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{thread.data?.thread.subject}</p>
                    <p className="text-xs text-ink-muted">AMS IT Services · {thread.data?.thread.status === 'closed' ? t('dashboard.closed') : t('dashboard.open')}</p>
                  </div>
                </div>
                {thread.loading && !thread.data ? <div className="flex flex-1 items-center justify-center"><Spinner className="text-brand-violet" /></div>
                  : <ChatMessages messages={thread.data?.messages} mine="user" labels={labels} />}
                <ChatComposer onSend={send} />
              </>
            )}
          </div>
        </div>
      </div>

      <NewThreadModal open={newOpen} onClose={() => setNewOpen(false)} onCreated={(id) => { setNewOpen(false); list.reload(); setActiveId(id); }} />
      {profileOpen && <ProfileModal open onClose={() => setProfileOpen(false)} />}
    </section>
  );
}
