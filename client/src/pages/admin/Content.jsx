import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { Field, Modal, Skeleton, Spinner } from '../../components/ui';
import { api, formatDate } from '../../lib/api';
import { useDebounced, useFetch } from '../../lib/useFetch';
import { useLocalized } from '../../i18n';
import { useToast } from '../../context/ToastContext';
import { categories, categoryLabel } from '../../data/content';
import { AdminHeader, DataTable, SearchBox } from './AdminLayout';

// Generic create/edit modal driven by a field list.
function EditorModal({ title, open, onClose, initial, fields, onSave }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title} wide>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <Field key={f.key} label={f.label} className={f.full ? 'sm:col-span-2' : ''}>
            {f.type === 'select' ? (
              <select className="input" value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)}>
                {f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea className={`input ${f.tall ? 'min-h-[240px] font-mono text-xs' : 'min-h-[90px]'}`} value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} required={f.required} />
            ) : f.type === 'checkbox' ? (
              <span className="flex h-[42px] items-center gap-2">
                <input type="checkbox" className="h-5 w-5 accent-brand-violet" checked={Boolean(form[f.key])} onChange={(e) => set(f.key, e.target.checked)} />
                <span className="text-sm">{t('common.yes')}</span>
              </span>
            ) : (
              <input className="input" type={f.type || 'text'} value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} required={f.required} />
            )}
          </Field>
        ))}
        <div className="flex justify-end gap-2 sm:col-span-2">
          <button type="button" onClick={onClose} className="btn-ghost">{t('common.cancel')}</button>
          <button className="btn-primary" disabled={busy}>{busy && <Spinner className="h-4 w-4" />} {t('common.save')}</button>
        </div>
      </form>
    </Modal>
  );
}

function useCrud(base, listKey) {
  const { t } = useTranslation();
  const toast = useToast();
  const [q, setQ] = useState('');
  const dq = useDebounced(q);
  const { data, loading, reload } = useFetch(`${base}?q=${encodeURIComponent(dq)}`);
  const [editing, setEditing] = useState(null); // null | 'new' | row

  const save = async (form) => {
    if (editing === 'new') await api.post(base, form);
    else await api.put(`${base}/${editing.id}`, form);
    toast(t('common.save') + ' ✓');
    reload();
  };
  const remove = async (row) => {
    if (!window.confirm(t('common.confirmDelete'))) return;
    try {
      await api.del(`${base}/${row.id}`);
      reload();
    } catch (e) {
      toast(e.message, 'error');
    }
  };
  return { q, setQ, rows: data?.[listKey] || [], loading: loading && !data, editing, setEditing, save, remove };
}

const RowActions = ({ onEdit, onDelete }) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-end gap-2">
      <button onClick={onEdit} className="btn-glass !p-2" aria-label={t('common.edit')}><Pencil className="h-4 w-4" /></button>
      <button onClick={onDelete} className="btn-danger !p-2" aria-label={t('common.delete')}><Trash2 className="h-4 w-4" /></button>
    </div>
  );
};

export function ProjectsPage() {
  const { t } = useTranslation();
  const { lang, pick } = useLocalized();
  const crud = useCrud('/admin/projects', 'projects');
  const [kind, setKind] = useState('');
  const rows = crud.rows.filter((r) => !kind || r.kind === kind);

  const kinds = [['product', 'Product'], ['app', 'App'], ['design', 'Design']];
  const fields = [
    { key: 'name', label: t('admin.name'), required: true },
    { key: 'kind', label: t('admin.kind'), type: 'select', options: kinds },
    { key: 'url', label: t('admin.url'), type: 'url' },
    { key: 'category', label: t('admin.category'), type: 'select', options: [['', '—'], ['saas', 'SaaS'], ...categories.map((c) => [c.key, c[lang]])] },
    { key: 'desc_en', label: t('admin.descEn'), type: 'textarea', full: true },
    { key: 'desc_es', label: t('admin.descEs'), type: 'textarea', full: true },
    { key: 'image', label: t('admin.image') },
    { key: 'sort', label: t('admin.sort'), type: 'number' },
    { key: 'featured', label: t('admin.featured'), type: 'checkbox' },
  ];
  const blank = { kind: 'app', name: '', url: '', category: 'home', desc_en: '', desc_es: '', image: '', featured: false, sort: 100 };
  const initial = crud.editing === 'new' ? blank
    : crud.editing && { ...blank, ...Object.fromEntries(Object.entries(crud.editing).map(([k, v]) => [k, v ?? ''])), featured: Boolean(crud.editing.featured) };

  return (
    <>
      <AdminHeader title={t('admin.projects')}>
        <SearchBox value={crud.q} onChange={crud.setQ} placeholder={t('common.search')} />
        <select value={kind} onChange={(e) => setKind(e.target.value)} className="input !w-auto !rounded-full" aria-label={t('admin.kind')}>
          <option value="">{t('admin.all')}</option>
          {kinds.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button onClick={() => crud.setEditing('new')} className="btn-primary"><Plus className="h-4 w-4" /> {t('admin.new')}</button>
      </AdminHeader>
      {crud.loading ? <Skeleton className="h-64" /> : (
        <DataTable
          empty={t('admin.noData')}
          rows={rows}
          columns={[
            {
              key: 'name', label: t('admin.name'),
              render: (p) => (
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  {p.featured ? <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> : null}{p.name}
                </span>
              ),
            },
            { key: 'kind', label: t('admin.kind'), render: (p) => <span className="badge bg-slate-100 text-ink-soft">{p.kind}</span> },
            { key: 'category', label: t('admin.category'), render: (p) => categoryLabel(p.category, lang) },
            { key: 'desc', label: t('admin.descEn'), className: 'md:max-w-xs', render: (p) => <span className="line-clamp-2 text-ink-soft">{pick(p, 'desc')}</span> },
            { key: 'url', label: t('admin.url'), render: (p) => p.url ? <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-indigo hover:underline"><ExternalLink className="h-3.5 w-3.5" /> Link</a> : '—' },
            { key: 'actions', label: '', className: 'text-right', render: (p) => <RowActions onEdit={() => crud.setEditing(p)} onDelete={() => crud.remove(p)} /> },
          ]}
        />
      )}
      {crud.editing && (
        <EditorModal open title={crud.editing === 'new' ? t('admin.new') : crud.editing.name} initial={initial} fields={fields}
          onClose={() => crud.setEditing(null)} onSave={(f) => crud.save({ ...f, sort: Number(f.sort) || 0 })} />
      )}
    </>
  );
}

export function PostsPage() {
  const { t } = useTranslation();
  const { lang, pick } = useLocalized();
  const crud = useCrud('/admin/posts', 'posts');
  const fields = [
    { key: 'title_en', label: t('admin.titleEn'), required: true },
    { key: 'title_es', label: t('admin.titleEs') },
    { key: 'slug', label: t('admin.slug') },
    { key: 'published_at', label: t('admin.date'), type: 'date' },
    { key: 'cover', label: t('admin.cover') },
    { key: 'published', label: t('admin.published'), type: 'checkbox' },
    { key: 'excerpt_en', label: t('admin.excerptEn'), type: 'textarea' },
    { key: 'excerpt_es', label: t('admin.excerptEs'), type: 'textarea' },
    { key: 'body_en', label: t('admin.bodyEn'), type: 'textarea', tall: true, full: true },
    { key: 'body_es', label: t('admin.bodyEs'), type: 'textarea', tall: true, full: true },
  ];
  const blank = { title_en: '', title_es: '', slug: '', published_at: new Date().toISOString().slice(0, 10), cover: '', published: true, excerpt_en: '', excerpt_es: '', body_en: '', body_es: '' };
  const initial = crud.editing === 'new' ? blank
    : crud.editing && { ...blank, ...Object.fromEntries(Object.entries(crud.editing).map(([k, v]) => [k, v ?? ''])), published: Boolean(crud.editing.published) };
  // Derive a slug from the English title for new posts when none was typed.
  const save = (f) => crud.save({
    ...f,
    slug: f.slug || f.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  });

  return (
    <>
      <AdminHeader title={t('admin.posts')}>
        <button onClick={() => crud.setEditing('new')} className="btn-primary"><Plus className="h-4 w-4" /> {t('admin.new')}</button>
      </AdminHeader>
      {crud.loading ? <Skeleton className="h-64" /> : (
        <DataTable
          empty={t('admin.noData')}
          rows={crud.rows}
          columns={[
            { key: 'title', label: t('admin.titleEn'), render: (p) => <span className="font-semibold">{pick(p, 'title')}</span> },
            { key: 'slug', label: t('admin.slug'), render: (p) => <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="text-brand-indigo hover:underline">/{p.slug}</a> },
            { key: 'published_at', label: t('admin.date'), render: (p) => formatDate(p.published_at, lang) },
            { key: 'published', label: t('admin.published'), render: (p) => <span className={`badge ${p.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-ink-soft'}`}>{p.published ? t('admin.published') : t('admin.draft')}</span> },
            { key: 'actions', label: '', className: 'text-right', render: (p) => <RowActions onEdit={() => crud.setEditing(p)} onDelete={() => crud.remove(p)} /> },
          ]}
        />
      )}
      {crud.editing && (
        <EditorModal open title={crud.editing === 'new' ? t('admin.new') : pick(crud.editing, 'title')} initial={initial} fields={fields}
          onClose={() => crud.setEditing(null)} onSave={save} />
      )}
    </>
  );
}
