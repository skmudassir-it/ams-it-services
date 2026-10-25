import { Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Img, Seo, Skeleton } from '../components/ui';
import { CtaBanner } from '../components/sections';
import { formatDate } from '../lib/api';
import { img } from '../lib/images';
import { useFetch } from '../lib/useFetch';
import { useLocalized } from '../i18n';

// Renders the CMS's lightweight markup: "## " headings, blank-line paragraphs and **bold** spans.
function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>);
}
function PostBody({ body }) {
  const blocks = body.split(/\n{2,}|\n(?=## )/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="prose-ams">
      {blocks.map((b, i) => {
        if (b.startsWith('## ')) {
          const [heading, ...rest] = b.split('\n');
          return (
            <Fragment key={i}>
              <h2>{heading.slice(3)}</h2>
              {rest.length > 0 && rest.map((line, j) => <p key={j}>{renderInline(line)}</p>)}
            </Fragment>
          );
        }
        return <p key={i}>{b.split('\n').map((line, j) => <Fragment key={j}>{j > 0 && <br />}{renderInline(line)}</Fragment>)}</p>;
      })}
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { lang, pick } = useLocalized();
  const { data, loading, error } = useFetch(`/posts/${slug}`);
  const post = data?.post;
  const cover = post && (post.cover?.startsWith('http') || post.cover?.startsWith('/') ? post.cover : img(`blog/${post.cover}.jpg`));

  return (
    <>
      {post && <Seo title={pick(post, 'title')} description={pick(post, 'excerpt')} />}
      <article className="pt-28 sm:pt-36">
        <div className="container max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-indigo hover:underline"><ArrowLeft className="h-4 w-4" /> {t('blogPage.back')}</Link>
          {loading && <div className="mt-8 space-y-4"><Skeleton className="h-12" /><Skeleton className="h-72" /><Skeleton className="h-40" /></div>}
          {error && <div className="glass mt-8 p-10 text-center text-ink-soft">{t('blogPage.notFound')}</div>}
          {post && (
            <>
              <p className="mt-8 flex items-center gap-2 text-sm text-ink-muted"><Calendar className="h-4 w-4" /> {formatDate(post.published_at, lang)}</p>
              <h1 className="mt-3 !text-[clamp(2rem,4vw,3rem)]">{pick(post, 'title')}</h1>
              <p className="lead mt-4">{pick(post, 'excerpt')}</p>
              <div className="mt-8 overflow-hidden rounded-[2rem] border-[6px] border-white shadow-lift">
                <Img src={cover} alt="" className="aspect-[16/9]" />
              </div>
              <div className="glass mt-8 p-6 sm:p-10">
                <PostBody body={pick(post, 'body')} />
              </div>
            </>
          )}
        </div>
      </article>
      <CtaBanner />
    </>
  );
}
