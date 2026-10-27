import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check, ChevronRight, ExternalLink, Server } from 'lucide-react';
import { Img, Reveal, SectionHeading, Seo } from '../components/ui';
import Icon from '../components/Icon';
import { amserp } from '../data/content';
import { useLocalized } from '../i18n';

const accent = 'bg-gradient-to-r from-indigo-500 to-teal-500';

export default function AmsErp() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const headline = pick(amserp.headline).replace(/\.$/, '');
  const split = headline.split(' ');

  return (
    <>
      <Seo title="AMS ERP" description={pick(amserp.summary)} />

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 sm:pt-36">
        <div className="pointer-events-none absolute -left-40 top-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-indigo-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-40 -z-10 h-[30rem] w-[30rem] rounded-full bg-teal-300/30 blur-3xl" />
        <div className="container">
          <Reveal className="mx-auto max-w-4xl text-center">
            <nav className="mb-6 flex items-center justify-center gap-1 text-sm text-ink-muted" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-ink">{t('nav.home')}</Link><ChevronRight className="h-4 w-4" />
              <span>{t('nav.products')}</span><ChevronRight className="h-4 w-4" />
              <span className="text-ink">AMS ERP</span>
            </nav>
            <div className="flex items-center justify-center gap-3">
              <img src="/amserp/logo.svg" alt="" className="h-14 w-14" />
              <div className="text-left">
                <p className="font-display text-3xl font-extrabold leading-none">AMS ERP</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">Enterprise suite</p>
              </div>
            </div>
            <span className="eyebrow mt-8">{pick(amserp.eyebrow)}</span>
            <h1 className="mt-5">
              {split.slice(0, -2).join(' ')}{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-teal-500 bg-clip-text text-transparent">{split.slice(-2).join(' ')}</span>.
            </h1>
            <p className="lead mx-auto mt-6 max-w-3xl">{pick(amserp.summary)}</p>
            <ul className="mt-6 flex flex-wrap justify-center gap-2">
              {amserp.highlights.map((h) => (
                <li key={h.en} className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-sm font-medium shadow-sm">
                  <Check className="h-4 w-4 text-teal-500" /> {pick(h)}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/contact" className={`btn btn-lg ${accent} text-white shadow-lg shadow-indigo-500/25 hover:brightness-105`}>{t('erp.demo')} <ArrowRight className="h-5 w-5" /></Link>
              <a href={amserp.url} target="_blank" rel="noreferrer" className="btn-glass btn-lg">{t('erp.visit')} <ExternalLink className="h-4 w-4" /></a>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-12 max-w-6xl">
            <div className="overflow-hidden rounded-[1.5rem] border-[6px] border-white bg-white shadow-lift">
              <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-300" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                <span className="ml-3 rounded-md bg-slate-100 px-2.5 py-0.5 text-[11px] text-ink-muted">amserp.org</span>
              </div>
              <Img src="/amserp/dashboard.jpg" alt="AMS ERP home dashboard: cash at bank, net income, receivables, payables and revenue charts" className="aspect-[16/10]" imgClassName="object-top" />
            </div>
          </Reveal>

          <div className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-3 lg:grid-cols-4">
            {amserp.stats.map((s) => (
              <div key={s.value} className="glass !rounded-2xl p-5 text-center">
                <p className="font-display text-4xl font-extrabold text-indigo-600">{s.value}</p>
                <p className="mt-1 text-sm font-medium text-ink-soft">{pick(s.label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="section" id="modules">
        <div className="container">
          <SectionHeading eyebrow={t('erp.modulesEyebrow')} title={t('erp.modulesTitle')} subtitle={t('erp.modulesSubtitle')} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {amserp.modules.map((m, i) => (
              <Reveal key={m.code} delay={(i % 3) * 0.05}>
                <div className="glass card-hover h-full p-6">
                  <div className="flex items-center justify-between">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent} text-white shadow-md`}><Icon name={m.icon} className="h-5 w-5" /></span>
                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 font-mono text-xs font-bold text-indigo-600">{m.code}</span>
                  </div>
                  <h3 className="mt-4">{pick(m.name)}</h3>
                  <ul className="mt-3 space-y-2">
                    {m.items.map((it) => (
                      <li key={it.en} className="flex gap-2 text-sm text-ink-soft"><Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" /> {pick(it)}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow={t('erp.howEyebrow')} title={t('erp.howTitle')} subtitle={t('erp.howSubtitle')} />
          <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {amserp.steps.map((s, i) => (
              <Reveal key={s.title.en} delay={i * 0.06}>
                <li className="glass relative h-full p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">{t('erp.step')} {i + 1}</p>
                  <h3 className="mt-2 text-base">{pick(s.title)}</h3>
                  <p className="mt-1 font-mono text-xs text-ink-muted">{pick(s.entry)}</p>
                  {i < amserp.steps.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-indigo-400 lg:block" />}
                </li>
              </Reveal>
            ))}
          </ol>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {amserp.pillars.map((p) => (
              <Reveal key={p.title.en}>
                <div className="h-full rounded-2xl bg-indigo-50/70 p-6">
                  <h3 className="text-base">{pick(p.title)}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{pick(p.text)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Platform */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow={t('erp.platformEyebrow')} title={t('erp.platformTitle')} subtitle={t('erp.platformSubtitle')} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {amserp.platform.map((p, i) => (
              <Reveal key={p.title.en} delay={(i % 4) * 0.05}>
                <div className="glass card-hover h-full p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600"><Icon name={p.icon} className="h-5 w-5" /></span>
                  <h3 className="mt-4 text-base">{pick(p.title)}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{pick(p.text)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Deploy + CTA */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-indigo-500 to-teal-500 p-8 text-white shadow-lift sm:p-14">
              <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
              <div className="relative grid items-center gap-10 lg:grid-cols-2">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider"><Server className="h-3.5 w-3.5" /> {t('erp.deployEyebrow')}</span>
                  <h2 className="mt-4 !text-white">{t('erp.deployTitle')}</h2>
                  <p className="mt-4 text-white/90">{t('erp.deployText')}</p>
                  <ul className="mt-6 space-y-2">
                    {amserp.deploy.map((d) => <li key={d.en} className="flex gap-2 text-sm text-white/95"><Check className="mt-0.5 h-4 w-4 shrink-0" /> {pick(d)}</li>)}
                  </ul>
                </div>
                <div className="rounded-3xl bg-white/10 p-6 backdrop-blur sm:p-8">
                  <h3 className="!text-xl !text-white">{t('erp.ctaTitle')}</h3>
                  <p className="mt-3 text-white/90">{t('erp.ctaText')}</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                    <Link to="/contact" className="btn btn-lg bg-white text-indigo-700 hover:bg-white/90">{t('erp.demo')} <ArrowRight className="h-5 w-5" /></Link>
                    <a href={amserp.loginUrl} target="_blank" rel="noreferrer" className="btn btn-lg border border-white/40 bg-white/10 text-white hover:bg-white/20">{t('erp.signIn')} <ExternalLink className="h-4 w-4" /></a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
