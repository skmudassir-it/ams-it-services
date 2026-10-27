import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowUpRight, Check, ExternalLink, MessageSquare, Sparkles } from 'lucide-react';
import { useLocalized } from '../i18n';
import { amserp, categoryLabel, dockpass, stats, techLogos } from '../data/content';
import { img, projectImage } from '../lib/images';
import { formatDate } from '../lib/api';
import { Counter, Img, Reveal, SectionHeading } from './ui';
import Icon from './Icon';

const initials = (name) => name.split(/[\s&-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export function ProjectCard({ project }) {
  const { t } = useTranslation();
  const { lang, pick } = useLocalized();
  const thumb = projectImage(project);
  const host = project.url ? project.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : '';
  return (
    <a href={project.url} target="_blank" rel="noreferrer" className="glass card-hover group flex flex-col overflow-hidden !rounded-3xl">
      <div className="relative m-2 overflow-hidden rounded-2xl border border-white">
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-white/90 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-rose-300" /><span className="h-2 w-2 rounded-full bg-amber-300" /><span className="h-2 w-2 rounded-full bg-emerald-300" />
          <span className="ml-2 truncate rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-ink-muted">{host}</span>
        </div>
        <Img src={thumb} alt={`${project.name} website screenshot`} fallbackText={initials(project.name)} className="aspect-[16/11]" imgClassName="object-top transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base">{project.name}</h3>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-ink-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-violet" />
        </div>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-soft">{pick(project, 'desc')}</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="badge bg-brand-50 text-brand-indigo">{categoryLabel(project.category, lang)}</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-soft group-hover:text-brand-indigo">
            {t('projectsPage.visit')} <ExternalLink className="h-3 w-3" />
          </span>
        </div>
      </div>
    </a>
  );
}

export function ServiceCard({ service, index = 0 }) {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  return (
    <Reveal delay={(index % 3) * 0.06}>
      <Link to={`/services/${service.slug}`} className="glass card-hover group flex h-full flex-col p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg shadow-brand-pink/20">
          <Icon name={service.icon} className="h-6 w-6" />
        </span>
        <h3 className="mt-5 text-lg">{pick(service.title)}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{pick(service.short)}</p>
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-indigo">
          {t('servicesPage.learnMore')} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </Link>
    </Reveal>
  );
}

export function PostCard({ post }) {
  const { t } = useTranslation();
  const { lang, pick } = useLocalized();
  const cover = post.cover?.startsWith('http') || post.cover?.startsWith('/') ? post.cover : img(`blog/${post.cover}.jpg`);
  return (
    <Link to={`/blog/${post.slug}`} className="glass card-hover group flex h-full flex-col overflow-hidden">
      <Img src={cover} alt="" className="m-2 aspect-[16/9] rounded-2xl" imgClassName="transition duration-700 group-hover:scale-105" />
      <div className="flex flex-1 flex-col px-5 pb-6 pt-3">
        <time className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{formatDate(post.published_at, lang)}</time>
        <h3 className="mt-2 text-lg leading-snug">{pick(post, 'title')}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft line-clamp-3">{pick(post, 'excerpt')}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-indigo">
          {t('blogPage.readMore')} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function StatsBand() {
  const { t } = useTranslation();
  return (
    <div className="glass grid grid-cols-2 gap-px overflow-hidden !rounded-3xl bg-white/40 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((s) => (
        <div key={s.key} className="bg-white/50 px-4 py-6 text-center">
          <div className="font-display text-3xl font-extrabold text-gradient sm:text-4xl"><Counter value={s.value} suffix={s.suffix} /></div>
          <div className="mt-1 text-xs font-medium text-ink-soft sm:text-sm">{t(`stats.${s.key}`)}</div>
        </div>
      ))}
    </div>
  );
}

export function LogoMarquee() {
  const { t } = useTranslation();
  const row = [...techLogos, ...techLogos];
  return (
    <div>
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">{t('home.techEyebrow')}</p>
      <div className="mask-fade-x mt-6 overflow-hidden">
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {row.map((logo, i) => (
            <div key={i} className="glass flex h-16 w-36 shrink-0 items-center justify-center !rounded-2xl px-5">
              <img src={`/logos/${logo}`} alt={logo.split('.')[0].replace(/[_-]/g, ' ')} className="max-h-8 max-w-full object-contain" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProcessSteps() {
  const { t } = useTranslation();
  const steps = t('process.steps', { returnObjects: true });
  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow={t('process.eyebrow')} title={t('process.title')} />
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.07}>
              <li className="glass relative h-full p-6">
                <span className="font-display text-5xl font-extrabold text-gradient opacity-90">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function CtaBanner() {
  const { t } = useTranslation();
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-gradient p-8 text-center text-white shadow-lift sm:p-14">
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="!text-white">{t('cta.title')}</h2>
              <p className="mt-4 text-base text-white/90 sm:text-lg">{t('cta.text')}</p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/contact" className="btn btn-lg bg-white text-ink shadow-lg hover:bg-white/90">{t('cta.primary')} <ArrowRight className="h-5 w-5" /></Link>
                <Link to="/dashboard" className="btn btn-lg border border-white/50 bg-white/15 text-white backdrop-blur hover:bg-white/25"><MessageSquare className="h-5 w-5" /> {t('cta.secondary')}</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// Home-page flagship: AMS ERP.
export function AmsErpShowcase() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  return (
    <section className="section relative" id="amserp">
      <div className="container">
        <Reveal>
          <div className="glass relative overflow-hidden !rounded-[2rem] p-5 sm:p-8 lg:p-12">
            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-teal-300/30 blur-3xl" />
            <div className="relative mx-auto max-w-3xl text-center">
              <span className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> {t('erp.eyebrow')}</span>
              <div className="mt-6 flex items-center justify-center gap-3">
                <img src="/amserp/logo.svg" alt="" className="h-12 w-12" />
                <div className="text-left">
                  <p className="font-display text-2xl font-extrabold leading-none">AMS ERP</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted">Enterprise suite</p>
                </div>
              </div>
              <h2 className="mt-6">
                {pick(amserp.headline).replace(/\.$/, '').split(' ').slice(0, -2).join(' ')}{' '}
                <span className="bg-gradient-to-r from-indigo-500 to-teal-500 bg-clip-text text-transparent">{pick(amserp.headline).replace(/\.$/, '').split(' ').slice(-2).join(' ')}</span>.
              </h2>
              <p className="lead mt-4">{pick(amserp.summary)}</p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/amserp" className="btn btn-lg bg-gradient-to-r from-indigo-500 to-teal-500 text-white shadow-lg shadow-indigo-500/25 hover:brightness-105">{t('erp.learnMore')} <ArrowRight className="h-5 w-5" /></Link>
                <a href={amserp.url} target="_blank" rel="noreferrer" className="btn-glass btn-lg">{t('erp.visit')} <ExternalLink className="h-4 w-4" /></a>
              </div>
            </div>

            <div className="relative mt-10 overflow-hidden rounded-2xl border border-white bg-white/70 shadow-lift">
              <div className="flex items-center gap-1.5 border-b border-slate-100 bg-white/90 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-300" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                <span className="ml-3 rounded-md bg-slate-100 px-2.5 py-0.5 text-[11px] text-ink-muted">amserp.org</span>
              </div>
              <Img src="/amserp/dashboard.jpg" alt="AMS ERP home dashboard with cash, income, receivables and payables KPIs" className="aspect-[16/10]" imgClassName="object-top" />
            </div>

            <div className="relative mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {amserp.stats.map((s) => (
                <div key={s.value} className="rounded-2xl bg-white/70 p-4 text-center">
                  <p className="font-display text-3xl font-extrabold text-indigo-600">{s.value}</p>
                  <p className="mt-1 text-xs font-medium text-ink-soft sm:text-sm">{pick(s.label)}</p>
                </div>
              ))}
            </div>

            <div className="relative mt-8 flex flex-wrap justify-center gap-2">
              {amserp.modules.map((m) => (
                <span key={m.code} className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-sm font-medium shadow-sm">
                  <span className="rounded bg-indigo-50 px-1.5 text-[11px] font-bold text-indigo-600">{m.code}</span> {pick(m.name)}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// Home-page product feature: DockPass.
export function DockPassShowcase() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  return (
    <section className="section relative" id="dockpass">
      <div className="container">
        <Reveal>
          <div className="glass relative overflow-hidden !rounded-[2rem] p-5 sm:p-8 lg:p-12">
            <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand-violet/20 blur-3xl" />
            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> {t('erp.alsoBy')}</span>
                <img src="/dockpass/logo.webp" alt="DockPass — Simple. Secure. Verified." className="mt-6 w-full max-w-sm" />
                <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-sky-700">{pick(dockpass.tagline)}</p>
                <h2 className="mt-2">{pick(dockpass.headline)}</h2>
                <p className="lead mt-4">{pick(dockpass.summary)}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {dockpass.highlights.map((h) => (
                    <li key={h.en} className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-sm font-medium shadow-sm">
                      <Check className="h-4 w-4 text-emerald-500" /> {pick(h)}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/dockpass" className="btn-primary btn-lg">{t('flagship.learnMore')} <ArrowRight className="h-5 w-5" /></Link>
                  <a href={dockpass.url} target="_blank" rel="noreferrer" className="btn-glass btn-lg">{t('flagship.visit')} <ExternalLink className="h-4 w-4" /></a>
                </div>
              </div>
              <div className="relative">
                <div className="overflow-hidden rounded-3xl border-4 border-white shadow-lift">
                  <Img src="/dockpass/dock.webp" alt="Trucks backed into the loading doors of a modern warehouse" className="aspect-[4/3]" />
                </div>
                <div className="glass-strong absolute -bottom-6 -left-2 w-[58%] overflow-hidden rounded-2xl border-4 border-white sm:-left-8">
                  <Img src="/dockpass/gate.webp" alt="A security officer scanning a driver's pickup pass at the warehouse gate" className="aspect-[4/3]" />
                </div>
                <div className="glass-strong absolute -right-2 -top-5 hidden rounded-2xl px-4 py-3 sm:block">
                  <p className="text-xs text-ink-muted">Pass #DP-4821</p>
                  <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-600"><Check className="h-4 w-4" /> Driver verified</p>
                </div>
              </div>
            </div>
            <div className="relative mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {dockpass.steps.map((s, i) => (
                <div key={s.title.en} className="rounded-2xl bg-white/70 p-5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">{i + 1}</span>
                  <h3 className="mt-3 text-base">{pick(s.title)}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{pick(s.text)}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
