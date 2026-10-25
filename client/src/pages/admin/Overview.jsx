import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, FolderKanban, Inbox, Mail, MessagesSquare, Users } from 'lucide-react';
import { Skeleton } from '../../components/ui';
import { formatDate } from '../../lib/api';
import { useFetch } from '../../lib/useFetch';
import { useLocalized } from '../../i18n';
import { AdminHeader } from './AdminLayout';

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
