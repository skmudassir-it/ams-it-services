import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ChevronDown, ExternalLink, Search, Sparkles } from 'lucide-react';
import { Img, PageHero, Reveal, Seo, Skeleton } from '../components/ui';
import { CtaBanner, ProjectCard } from '../components/sections';
import { categories } from '../data/content';
import { img } from '../lib/images';
import { useFetch } from '../lib/useFetch';
import { useLocalized } from '../i18n';

// Per-product page link and branding; products added in the CMS without an entry fall back to name + live link.
const PRODUCT_PAGES = {
  'AMS ERP': {
    page: '/amserp',
    brand: (
      <span className="mt-4 flex items-center gap-3">
        <img src="/amserp/logo.svg" alt="" className="h-12 w-12" />
        <span className="font-display text-3xl font-extrabold">AMS ERP</span>
      </span>
    ),
  },
  DockPass: { page: '/dockpass', brand: <img src="/dockpass/logo.webp" alt="DockPass" className="mt-4 w-56" /> },
};

function ProductBanner({ product }) {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const meta = PRODUCT_PAGES[product.name];
  return (
    <Reveal>
      <div className="glass grid items-center gap-6 overflow-hidden !rounded-[2rem] p-4 sm:p-6 md:grid-cols-[1.1fr_1fr]">
        <div className="overflow-hidden rounded-2xl">
          <Img src={product.image} alt={product.name} className="aspect-[16/9]" imgClassName="object-top" />
        </div>
        <div className="p-2">
          <span className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> {product.featured ? t('hero.flagship') : t('projectsPage.products')}</span>
          {meta?.brand || <h2 className="mt-4">{product.name}</h2>}
          <p className="lead mt-3">{pick(product, 'desc')}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {meta && <Link to={meta.page} className="btn-primary">{t('servicesPage.learnMore')} <ArrowRight className="h-4 w-4" /></Link>}
            {product.url && <a href={product.url} target="_blank" rel="noreferrer" className="btn-glass">{product.url.replace(/^https?:\/\//, '')} <ExternalLink className="h-4 w-4" /></a>}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function Projects() {
  const { t } = useTranslation();
  const { lang, pick } = useLocalized();
  const { data, loading } = useFetch('/projects');
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  const products = data?.projects.filter((p) => p.kind === 'product') || [];
  const apps = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data?.projects || []).filter((p) => p.kind === 'app'
      && (category === 'all' || p.category === category)
      && (!q || p.name.toLowerCase().includes(q) || pick(p, 'desc').toLowerCase().includes(q)));
  }, [data, category, query, pick]);

  const counts = useMemo(() => {
    const c = {};
    (data?.projects || []).filter((p) => p.kind === 'app').forEach((p) => { c[p.category] = (c[p.category] || 0) + 1; });
    return c;
  }, [data]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const subtitle = t('projectsPage.subtitle', { count: total || '150+', industries: Object.keys(counts).length || 15 });

  // Render in pages so 150+ cards (and their screenshots) don't load at once.
  const PAGE = 24;
  const [visible, setVisible] = useState(PAGE);
  useEffect(() => { setVisible(PAGE); }, [category, query]);

  return (
    <>
      <Seo title={t('nav.projects')} description={subtitle} />
      <PageHero eyebrow={t('home.projectsEyebrow')} title={t('projectsPage.title')} subtitle={subtitle} image={img('projects-hero.jpg')}>
        <p className="mt-4 text-sm font-semibold text-brand-indigo">{t('projectsPage.stack')}</p>
      </PageHero>

      <section className="pb-12">
        <div className="container space-y-6">
          {products.map((p) => <ProductBanner key={p.id} product={p} />)}
        </div>
      </section>

      <section className="pb-16">
        <div className="container">
          <div className="glass-strong sticky top-20 z-30 -mx-1 rounded-2xl p-3 sm:top-24">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative lg:w-72">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('projectsPage.search')} className="input !rounded-full pl-10" aria-label={t('projectsPage.search')} />
              </div>
              <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 lg:mx-0 lg:flex-1 lg:px-0">
                <button onClick={() => setCategory('all')} className={category === 'all' ? 'chip-on' : 'chip-off'}>
                  {t('projectsPage.all')} <span className="opacity-60">{total}</span>
                </button>
                {categories.map((c) => (
                  <button key={c.key} onClick={() => setCategory(c.key)} className={category === c.key ? 'chip-on' : 'chip-off'}>
                    {c[lang]} <span className="opacity-60">{counts[c.key] || 0}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-ink-muted">{t('projectsPage.showing', { count: apps.length })}</p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80" />)}
            {apps.slice(0, visible).map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
          {apps.length > visible && (
            <div className="mt-10 flex flex-col items-center gap-2">
              <button onClick={() => setVisible((v) => v + PAGE)} className="btn-glass btn-lg">
                {t('projectsPage.more')} <ChevronDown className="h-5 w-5" />
              </button>
              <p className="text-xs text-ink-muted">{t('projectsPage.progress', { shown: visible, total: apps.length })}</p>
            </div>
          )}
          {!loading && apps.length === 0 && (
            <div className="glass mt-6 p-10 text-center text-ink-soft">{t('projectsPage.empty')}</div>
          )}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
