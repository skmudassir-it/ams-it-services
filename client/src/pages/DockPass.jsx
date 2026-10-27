import { useTranslation } from 'react-i18next';
import { ArrowRight, Check, ExternalLink, ScanLine, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { Img, Reveal, SectionHeading, Seo } from '../components/ui';
import Icon from '../components/Icon';
import { dockpass } from '../data/content';
import { img } from '../lib/images';
import { useLocalized } from '../i18n';

export default function DockPass() {
  const { t } = useTranslation();
  const { pick } = useLocalized();

  return (
    <>
      <Seo title="DockPass" description={pick(dockpass.summary)} />

      <section className="relative overflow-hidden pt-28 sm:pt-36">
        <div className="pointer-events-none absolute -right-40 top-10 -z-10 h-[30rem] w-[30rem] rounded-full bg-sky-300/30 blur-3xl" />
        <div className="container grid items-center gap-12 pb-16 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow">{t('nav.products')} · AMS IT Services</span>
            <img src="/dockpass/logo.webp" alt="DockPass — Simple. Secure. Verified." className="mt-6 w-full max-w-md" />
            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-sky-700">{pick(dockpass.tagline)}</p>
            <h1 className="mt-2">{pick(dockpass.headline)}</h1>
            <p className="lead mt-5">{pick(dockpass.summary)}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {dockpass.highlights.map((h) => (
                <li key={h.en} className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-sm font-medium shadow-sm">
                  <Check className="h-4 w-4 text-emerald-500" /> {pick(h)}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={dockpass.registerUrl} target="_blank" rel="noreferrer" className="btn btn-lg bg-sky-600 text-white shadow-lg shadow-sky-600/25 hover:bg-sky-700">{t('flagship.register')} <ArrowRight className="h-5 w-5" /></a>
              <a href={dockpass.demoUrl} target="_blank" rel="noreferrer" className="btn-glass btn-lg">{t('flagship.demo')} <ExternalLink className="h-4 w-4" /></a>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-[2rem] border-[6px] border-white shadow-lift">
              <Img src="/dockpass/dock.webp" alt="Trucks backed into the loading doors of a modern warehouse" className="aspect-[4/3]" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow={t('dockpassPage.problemEyebrow')} title={t('dockpassPage.problemTitle')} />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {dockpass.problems.map((p, i) => (
              <Reveal key={p.title.en} delay={i * 0.07}>
                <div className="glass h-full p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500"><Icon name={p.icon} className="h-6 w-6" /></span>
                  <h3 className="mt-4">{pick(p.title)}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{pick(p.text)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow={t('dockpassPage.howEyebrow')} title={t('dockpassPage.howTitle')} />
          <ol className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dockpass.steps.map((s, i) => (
              <Reveal key={s.title.en} delay={i * 0.07}>
                <li className="glass h-full p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 font-bold text-white shadow-lg shadow-sky-600/25">{i + 1}</span>
                  <h3 className="mt-4">{pick(s.title)}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{pick(s.text)}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] border-[6px] border-white shadow-lift">
                <Img src="/dockpass/gate.webp" alt="A security officer scanning a driver's pickup pass at the warehouse gate" className="aspect-[4/3]" />
              </div>
              <div className="glass-strong absolute -bottom-6 left-4 space-y-2 rounded-2xl p-4 text-sm sm:left-8">
                <p className="flex items-center gap-2 font-semibold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Gate 3 · Pass valid · Driver match</p>
                <p className="flex items-center gap-2 font-semibold text-rose-500"><XCircle className="h-4 w-4" /> Gate 1 · Pass already used</p>
              </div>
            </div>
          </Reveal>
          <div>
            <span className="eyebrow"><ScanLine className="h-3.5 w-3.5" /> {t('dockpassPage.featuresEyebrow')}</span>
            <h2 className="mt-4">{t('dockpassPage.gateTitle')}</h2>
            <p className="lead mt-4">{t('dockpassPage.gateText')}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow={t('dockpassPage.featuresEyebrow')} title={t('dockpassPage.featuresTitle')} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dockpass.features.map((f, i) => (
              <Reveal key={f.title.en} delay={i * 0.06}>
                <div className="glass card-hover h-full p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600"><Icon name={f.icon} className="h-6 w-6" /></span>
                  <h3 className="mt-4">{pick(f.title)}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{pick(f.text)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-white shadow-lift">
            <Img src={img('dockpass-hero.jpg')} alt="" className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/70 to-sky-900/50" />
            <div className="relative p-8 sm:p-14">
              <h2 className="max-w-2xl !text-white">{t('dockpassPage.industriesTitle')}</h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {dockpass.industries.map((ind) => (
                  <li key={ind.en} className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">{pick(ind)}</li>
                ))}
              </ul>
              <p className="mt-10 flex max-w-2xl items-start gap-2 text-lg text-white/90"><ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-sky-300" /> {t('dockpassPage.ctaTitle')}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={dockpass.registerUrl} target="_blank" rel="noreferrer" className="btn btn-lg bg-white text-ink hover:bg-white/90">{t('flagship.register')} <ArrowRight className="h-5 w-5" /></a>
                <a href={dockpass.url} target="_blank" rel="noreferrer" className="btn btn-lg border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20">{t('flagship.visit')} <ExternalLink className="h-4 w-4" /></a>
              </div>
              <p className="mt-8 text-sm text-white/70">{t('dockpassPage.founder')} · {t('flagship.built')}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
