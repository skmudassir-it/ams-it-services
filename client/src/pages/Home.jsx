import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Globe2, CheckCircle2, Sparkles, MapPin } from 'lucide-react';
import { Img, Reveal, SectionHeading, Seo, Skeleton } from '../components/ui';
import { CtaBanner, DockPassShowcase, LogoMarquee, PostCard, ProcessSteps, ProjectCard, ServiceCard, StatsBand } from '../components/sections';
import { services } from '../data/content';
import { img } from '../lib/images';
import { useFetch } from '../lib/useFetch';

function Hero() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-36 lg:pt-40">
      <div className="container grid items-center gap-12 pb-12 lg:grid-cols-[1.05fr_1fr] lg:pb-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <span className="eyebrow"><Globe2 className="h-3.5 w-3.5" /> {t('hero.eyebrow')}</span>
          <h1 className="mt-6">
            {t('hero.title1')} <span className="text-gradient">{t('hero.title2')}</span>
          </h1>
          <p className="lead mt-6 max-w-xl">{t('hero.subtitle')}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/services" className="btn-primary btn-lg">{t('hero.ctaPrimary')} <ArrowRight className="h-5 w-5" /></Link>
            <Link to="/contact" className="btn-glass btn-lg">{t('hero.ctaSecondary')}</Link>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {['1573164713988-8665fc963095', '1507003211169-0a1dd7228f2d', '1515378791036-0648a3ef77b2', '1600880292089-90a7e086ee0c'].map((id) => (
                <img key={id} src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=80&h=80&q=70`} alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
              ))}
            </div>
            <div>
              <div className="flex text-amber-400">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <p className="text-xs font-medium text-ink-soft sm:text-sm">{t('hero.rating')}</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="relative" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }}>
          <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-brand-gradient opacity-20 blur-3xl" />
          <div className="overflow-hidden rounded-[2rem] border-[6px] border-white shadow-lift">
            <Img src={img('hero.jpg')} alt="AMS IT Services team workspace" className="aspect-[4/3.4] sm:aspect-[4/3]" />
          </div>
          <div className="glass-strong absolute -left-3 bottom-8 animate-float rounded-2xl p-4 sm:-left-10">
            <p className="font-display text-3xl font-extrabold text-gradient">150+</p>
            <p className="text-xs font-medium text-ink-soft">{t('hero.liveApps')}</p>
          </div>
          <Link to="/dockpass" className="glass-strong absolute -right-2 -top-5 flex items-center gap-3 rounded-2xl p-3 transition hover:scale-[1.02] sm:-right-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white"><Sparkles className="h-5 w-5" /></span>
            <span>
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-muted">{t('hero.flagship')}</span>
              <span className="block font-display text-sm font-extrabold">DockPass</span>
            </span>
          </Link>
          <div className="glass-strong absolute -bottom-5 right-6 hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold sm:flex">
            <MapPin className="h-4 w-4 text-brand-pink" /> Memphis · Hyderabad
          </div>
        </motion.div>
      </div>
      <div className="container pb-6">
        <StatsBand />
      </div>
    </section>
  );
}

function FeaturedProjects() {
  const { t } = useTranslation();
  const { data, loading } = useFetch('/projects?kind=app&featured=1');
  return (
    <section className="section">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading center={false} eyebrow={t('home.projectsEyebrow')} title={t('home.projectsTitle')} subtitle={t('home.projectsSubtitle')} />
          <Link to="/projects" className="btn-glass shrink-0">{t('home.viewAllProjects')} <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80" />)}
          {data?.projects.slice(0, 6).map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.06}><ProjectCard project={p} /></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const { t } = useTranslation();
  const why = t('home.why', { returnObjects: true });
  return (
    <section className="section">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="overflow-hidden rounded-[2rem] border-[6px] border-white shadow-lift">
            <Img src={img('about-team.jpg')} alt="AMS IT Services team collaborating" className="aspect-[4/3]" />
          </div>
          <div className="glass-strong absolute -bottom-6 right-4 rounded-2xl p-4 sm:-right-6">
            <p className="font-display text-2xl font-extrabold text-gradient">8+ yrs · 50+</p>
            <p className="text-xs text-ink-soft">{t('stats.years')} · {t('stats.team')}</p>
          </div>
        </Reveal>
        <div>
          <SectionHeading center={false} eyebrow={t('home.aboutEyebrow')} title={t('home.aboutTitle')} subtitle={t('home.aboutText')} />
          <h3 className="mt-8 text-base text-ink-muted">{t('home.whyTitle')}</h3>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {why.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.06}>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-violet" />
                  <div>
                    <p className="font-semibold">{w.title}</p>
                    <p className="mt-1 text-sm text-ink-soft">{w.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
          <Link to="/about" className="btn-glass mt-8">{t('nav.about')} <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}

function LatestPosts() {
  const { t } = useTranslation();
  const { data } = useFetch('/posts');
  if (!data?.posts.length) return null;
  return (
    <section className="section">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading center={false} eyebrow={t('home.blogEyebrow')} title={t('home.blogTitle')} />
          <Link to="/blog" className="btn-glass shrink-0">{t('home.readAll')} <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {data.posts.slice(0, 3).map((p, i) => <Reveal key={p.id} delay={i * 0.06}><PostCard post={p} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <Seo description={t('hero.subtitle')} />
      <Hero />
      <DockPassShowcase />
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow={t('home.servicesEyebrow')} title={t('home.servicesTitle')} subtitle={t('home.servicesSubtitle')} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.filter((s) => s.core).map((s, i) => <ServiceCard key={s.slug} service={s} index={i} />)}
          </div>
          <div className="mt-10 text-center">
            <Link to="/services" className="btn-glass">{t('nav.allServices')} <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
      <FeaturedProjects />
      <section className="py-8"><div className="container"><LogoMarquee /></div></section>
      <About />
      <ProcessSteps />
      <LatestPosts />
      <CtaBanner />
    </>
  );
}
