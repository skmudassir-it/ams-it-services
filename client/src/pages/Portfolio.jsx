import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Maximize2 } from 'lucide-react';
import { Img, Modal, PageHero, Reveal, Seo, Skeleton } from '../components/ui';
import { CtaBanner } from '../components/sections';
import { img } from '../lib/images';
import { useFetch } from '../lib/useFetch';
import { useLocalized } from '../i18n';

export default function Portfolio() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const { data, loading } = useFetch('/projects?kind=design');
  const [active, setActive] = useState(null);

  return (
    <>
      <Seo title={t('nav.portfolio')} description={t('portfolioPage.subtitle')} />
      <PageHero eyebrow={t('nav.portfolio')} title={t('portfolioPage.title')} subtitle={t('portfolioPage.subtitle')} image={img('portfolio-hero.jpg')} />
      <section className="pb-16">
        <div className="container">
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
            {loading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 break-inside-avoid" />)}
            {data?.projects.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.05} className="break-inside-avoid">
                <button onClick={() => setActive(p)} className="glass card-hover group block w-full overflow-hidden text-left">
                  <div className="relative m-2 overflow-hidden rounded-2xl">
                    <img src={p.image} alt={`${p.name} store design`} loading="lazy" className="w-full transition duration-700 group-hover:scale-105" />
                    <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 opacity-0 transition group-hover:bg-slate-900/25 group-hover:opacity-100">
                      <span className="glass-strong inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"><Maximize2 className="h-4 w-4" /> {t('portfolioPage.view')}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-5 pb-4 pt-2">
                    <h3 className="text-base">{p.name}</h3>
                    <span className="badge bg-brand-50 text-brand-indigo">{pick(p, 'desc')}</span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Modal open={Boolean(active)} onClose={() => setActive(null)} title={active?.name} wide>
        {active && <Img src={active.image} alt={active.name} className="rounded-2xl" imgClassName="!h-auto" />}
      </Modal>
      <CtaBanner />
    </>
  );
}
