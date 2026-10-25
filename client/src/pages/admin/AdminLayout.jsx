import { Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, ExternalLink, FolderKanban, Inbox, LayoutDashboard, LogOut, Mail, Menu, MessagesSquare, Users, X } from 'lucide-react';
import { LanguageToggle } from '../../components/Navbar';
import { PageLoader } from '../../components/Layout';
import { Seo } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);

  const items = [
    ['/admin', t('admin.overview'), LayoutDashboard, true],
    ['/admin/messages', t('admin.messages'), MessagesSquare],
    ['/admin/users', t('admin.users'), Users],
    ['/admin/subscribers', t('admin.subscribers'), Mail],
    ['/admin/requests', t('admin.requests'), Inbox],
    ['/admin/projects', t('admin.projects'), FolderKanban],
    ['/admin/posts', t('admin.posts'), BookOpen],
  ];

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2.5 px-2">
        <img src="/logo.jpg" alt="AMS IT Services" className="h-10 w-10 rounded-xl object-cover" />
        <div>
          <p className="font-display text-sm font-extrabold leading-tight">AMS IT Services</p>
          <p className="text-xs text-ink-muted">{t('admin.title')} CMS</p>
        </div>
      </Link>
      <nav className="mt-8 flex flex-col gap-1">
        {items.map(([to, label, IconCmp, end]) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-white text-ink shadow-sm' : 'text-ink-soft hover:bg-white/60 hover:text-ink'}`}>
            <IconCmp className="h-4 w-4" /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto space-y-2 border-t border-white/80 pt-4">
        <div className="flex items-center justify-between px-2"><span className="text-xs text-ink-muted">{t('nav.language')}</span><LanguageToggle /></div>
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-soft hover:bg-white/60"><ExternalLink className="h-4 w-4" /> {t('admin.viewSite')}</Link>
        <div className="flex items-center gap-3 rounded-xl bg-white/60 px-3 py-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">{user.name[0]}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-ink-muted">{user.email}</p>
          </div>
          <button onClick={async () => { await logout(); navigate('/'); }} className="text-ink-muted hover:text-rose-600" aria-label={t('nav.logout')}><LogOut className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[272px_1fr]">
      <Seo title={t('admin.title')} />
      <aside className="glass-strong sticky top-0 hidden h-screen !rounded-none border-y-0 border-l-0 p-5 lg:block">{sidebar}</aside>

      <header className="glass-strong sticky top-0 z-40 flex items-center justify-between !rounded-none px-4 py-3 lg:hidden">
        <Link to="/admin" className="flex items-center gap-2"><img src="/logo.jpg" alt="" className="h-9 w-9 rounded-lg" /><span className="font-display font-extrabold">{t('admin.title')}</span></Link>
        <button onClick={() => setOpen(true)} className="btn-glass !p-2.5" aria-label={t('nav.menu')}><Menu className="h-5 w-5" /></button>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="glass-strong absolute inset-y-0 left-0 w-72 !rounded-r-3xl p-5">
            <button onClick={() => setOpen(false)} className="btn-ghost absolute right-3 top-3 !p-2" aria-label="Close"><X className="h-5 w-5" /></button>
            {sidebar}
          </aside>
        </div>
      )}

      <main className="min-w-0 p-4 sm:p-6 lg:p-10">
        <Suspense fallback={<PageLoader />}><Outlet /></Suspense>
      </main>
    </div>
  );
}

export function AdminHeader({ title, children }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <h1 className="!text-2xl sm:!text-3xl">{title}</h1>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

// Responsive table: a real table on md+ screens, stacked cards on phones.
export function DataTable({ columns, rows, empty, rowKey = 'id' }) {
  if (!rows?.length) return <div className="glass p-10 text-center text-sm text-ink-muted">{empty}</div>;
  return (
    <>
      <div className="glass hidden overflow-x-auto !rounded-2xl md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white text-xs uppercase tracking-wider text-ink-muted">
              {columns.map((c) => <th key={c.key} className={`px-4 py-3 font-semibold ${c.className || ''}`}>{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[rowKey]} className="border-b border-white/70 last:border-0 hover:bg-white/50">
                {columns.map((c) => <td key={c.key} className={`px-4 py-3 align-top ${c.className || ''}`}>{c.render ? c.render(r) : r[c.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {rows.map((r) => (
          <div key={r[rowKey]} className="glass space-y-2 !rounded-2xl p-4 text-sm">
            {columns.map((c) => (
              <div key={c.key} className="flex items-start justify-between gap-4">
                <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-ink-muted">{c.label}</span>
                <span className="min-w-0 break-words text-right">{c.render ? c.render(r) : r[c.key]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export function SearchBox({ value, onChange, placeholder }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input !w-full !rounded-full sm:!w-64" aria-label={placeholder} />;
}
