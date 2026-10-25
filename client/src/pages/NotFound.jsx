import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Img, Seo } from '../components/ui';
import { img } from '../lib/images';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <section className="pt-32 pb-20 sm:pt-40">
      <Seo title={t('common.notFoundTitle')} />
      <div className="container">
        <div className="glass mx-auto grid max-w-4xl items-center gap-8 overflow-hidden !rounded-[2rem] p-6 sm:p-10 md:grid-cols-2">
          <Img src={img('notfound.jpg')} alt="" className="aspect-square rounded-3xl" />
          <div>
            <p className="font-display text-7xl font-extrabold text-gradient">404</p>
            <h1 className="mt-2 !text-3xl">{t('common.notFoundTitle')}</h1>
            <p className="mt-3 text-ink-soft">{t('common.notFoundText')}</p>
            <Link to="/" className="btn-primary mt-6"><ArrowLeft className="h-4 w-4" /> {t('common.backHome')}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
