import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check, ChevronRight, Gauge, Search, ShieldCheck, Smartphone } from 'lucide-react';
import { Img, Reveal, SectionHeading, Seo } from '../components/ui';
import { CtaBanner, ProcessSteps, ServiceCard } from '../components/sections';
import Icon from '../components/Icon';
import { services } from '../data/content';
import { img } from '../lib/images';
import { useLocalized } from '../i18n';
import NotFound from './NotFound';

const techIcons = [Gauge, Search, Smartphone, ShieldCheck];

export default function ServiceDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const service = services.find((s) => s.slug === slug);
  if (!service) return <NotFound />;

  const related = services.filter((s) => s.slug !== slug && s.core === service.core).slice(0, 3);
  const tech = t('servicesPage.tech', { returnObjects: true });

  return (
    <>
      <Seo title={pick(service.title)} description={pick(service.short)} />
      <section className="relative pt-28 sm:pt-36">
        <div className="container grid items-center gap-12 pb-12 lg:grid-cols-2">
          <Reveal>
            <nav className="flex items-center gap-1 text-sm text-ink-muted" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-ink">{t('nav.home')}</Link><ChevronRight className="h-4 w-4" />
              <Link to="/services" className="hover:text-ink">{t('nav.services')}</Link><ChevronRight className="h-4 w-4" />
              <span className="text-ink">{pick(service.title)}</span>
            </nav>
            <span className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg shadow-brand-pink/25">
              <Icon name={service.icon} className="h-7 w-7" />
            </span>
            <h1 className="mt-5">{pick(service.title)}</h1>
            <p className="lead mt-5">{pick(service.intro)}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="btn-primary btn-lg">{t('servicesPage.start')} <ArrowRight className="h-5 w-5" /></Link>
              <Link to="/projects" className="btn-glass btn-lg">{t('nav.projects')}</Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-[2rem] border-[6px] border-white shadow-lift">
              <Img src={img(`services/${service.slug}.jpg`)} alt={pick(service.title)} className="aspect-[4/3]" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading center={false} eyebrow={t('servicesPage.whatWeDo')} title={pick(service.short)} />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {service.features.map((f, i) => (
              <Reveal key={f.en} delay={i * 0.06}>
                <li className="glass flex h-full gap-3 p-5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check className="h-4 w-4" /></span>
                  <span className="text-sm font-medium leading-relaxed">{pick(f)}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-8">
        <div className="container">
          <div className="glass grid gap-6 !rounded-[2rem] p-6 sm:grid-cols-2 sm:p-10 lg:grid-cols-4">
            <h3 className="sm:col-span-2 lg:col-span-4 text-xl">{t('servicesPage.techTitle')}</h3>
            {tech.map((label, i) => {
              const TIcon = techIcons[i];
              return (
                <div key={label} className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-indigo shadow-sm"><TIcon className="h-5 w-5" /></span>
                  <span className="text-sm font-semibold">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ProcessSteps />

      <section className="pb-8">
        <div className="container">
          <SectionHeading center={false} title={t('servicesPage.related')} />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s, i) => <ServiceCard key={s.slug} service={s} index={i} />)}
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
