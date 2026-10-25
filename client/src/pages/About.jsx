import { useTranslation } from 'react-i18next';
import { Award, Eye, HeartHandshake, Lightbulb, MapPin } from 'lucide-react';
import { Img, PageHero, Reveal, SectionHeading, Seo } from '../components/ui';
import { CtaBanner, DockPassShowcase, LogoMarquee, StatsBand } from '../components/sections';
import { img } from '../lib/images';

const valueIcons = [Award, Eye, HeartHandshake, Lightbulb];

export default function About() {
  const { t } = useTranslation();
  const story = t('about.story', { returnObjects: true });
  const values = t('about.values', { returnObjects: true });
  const offices = [
    { title: t('about.usa'), city: 'Memphis, Tennessee, USA', text: t('about.usaText'), flag: '🇺🇸' },
    { title: t('about.india'), city: 'Hyderabad, Telangana, India', text: t('about.indiaText'), flag: '🇮🇳' },
  ];

  return (
    <>
      <Seo title={t('nav.about')} description={t('about.subtitle')} />
      <PageHero eyebrow={t('nav.about')} title={t('about.title')} subtitle={t('about.subtitle')} image={img('about-hero.jpg')} />

      <section className="pb-8"><div className="container"><StatsBand /></div></section>

      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading center={false} eyebrow={t('about.storyTitle')} title={t('home.aboutTitle')} />
            <div className="mt-6 space-y-4">
              {story.map((p, i) => <Reveal key={i} delay={i * 0.05}><p className="lead">{p}</p></Reveal>)}
            </div>
          </div>
          <Reveal>
            <div className="grid grid-cols-2 gap-4">
              <div className="overflow-hidden rounded-3xl border-[5px] border-white shadow-lift">
                <Img src="/about-feature.jpg" alt="AMS IT Services team" className="aspect-[3/4]" />
              </div>
              <div className="mt-10 overflow-hidden rounded-3xl border-[5px] border-white shadow-lift">
                <Img src={img('about-team.jpg')} alt="Engineers collaborating" className="aspect-[3/4]" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title={t('about.valuesTitle')} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const VIcon = valueIcons[i];
              return (
                <Reveal key={v.title} delay={i * 0.06}>
                  <div className="glass h-full p-6 text-center">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white"><VIcon className="h-6 w-6" /></span>
                    <h3 className="mt-4">{v.title}</h3>
                    <p className="mt-2 text-sm text-ink-soft">{v.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title={t('about.officesTitle')} />
          <Reveal className="mt-10 overflow-hidden rounded-[2rem] border-[6px] border-white shadow-lift">
            <Img src={img('offices.jpg')} alt="Memphis and Hyderabad offices" className="aspect-[21/9]" />
          </Reveal>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {offices.map((o) => (
              <Reveal key={o.city}>
                <div className="glass flex items-start gap-4 p-6">
                  <span className="text-4xl" aria-hidden>{o.flag}</span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-indigo">{o.title}</p>
                    <h3 className="mt-1 flex items-center gap-1.5"><MapPin className="h-4 w-4 text-brand-pink" /> {o.city}</h3>
                    <p className="mt-1 text-sm text-ink-soft">{o.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <DockPassShowcase />
      <section className="py-8"><div className="container"><LogoMarquee /></div></section>
      <CtaBanner />
    </>
  );
}
