import { useTranslation } from 'react-i18next';
import { PageHero, Reveal, Seo, Skeleton } from '../components/ui';
import { CtaBanner, PostCard } from '../components/sections';
import { img } from '../lib/images';
import { useFetch } from '../lib/useFetch';

export default function Blog() {
  const { t } = useTranslation();
  const { data, loading } = useFetch('/posts');
  return (
    <>
      <Seo title={t('nav.blog')} description={t('blogPage.subtitle')} />
      <PageHero eyebrow={t('nav.blog')} title={t('blogPage.title')} subtitle={t('blogPage.subtitle')} image={img('blog-hero.jpg')} />
      <section className="pb-16">
        <div className="container grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-96" />)}
          {data?.posts.map((p, i) => <Reveal key={p.id} delay={(i % 3) * 0.06}><PostCard post={p} /></Reveal>)}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
