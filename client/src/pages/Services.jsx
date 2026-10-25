import { useTranslation } from 'react-i18next';
import { PageHero, SectionHeading, Seo } from '../components/ui';
import { CtaBanner, LogoMarquee, ProcessSteps, ServiceCard } from '../components/sections';
import { services } from '../data/content';
import { img } from '../lib/images';

export default function Services() {
  const { t } = useTranslation();
  const groups = [
    { title: t('nav.coreServices'), items: services.filter((s) => s.core) },
    { title: t('nav.moreServices'), items: services.filter((s) => !s.core) },
  ];
  return (
    <>
      <Seo title={t('nav.services')} description={t('servicesPage.subtitle')} />
      <PageHero eyebrow={t('nav.services')} title={t('servicesPage.title')} subtitle={t('servicesPage.subtitle')} image={img('services-hero.jpg')} />
      {groups.map((g) => (
        <section key={g.title} className="pb-16">
          <div className="container">
            <SectionHeading center={false} title={g.title} />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((s, i) => <ServiceCard key={s.slug} service={s} index={i} />)}
            </div>
          </div>
        </section>
      ))}
      <ProcessSteps />
      <section className="py-8"><div className="container"><LogoMarquee /></div></section>
      <CtaBanner />
    </>
  );
}
