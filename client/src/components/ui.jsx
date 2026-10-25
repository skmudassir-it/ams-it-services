import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useInView, animate } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';

export function Seo({ title, description }) {
  const full = title ? `${title} | AMS IT Services` : 'AMS IT Services — Web, Mobile, Cloud & Product Engineering';
  return (
    <Helmet>
      <title>{full}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={full} />
    </Helmet>
  );
}

// Image with a graceful gradient placeholder while loading or if the source fails.
export function Img({ src, alt = '', className = '', imgClassName = '', fallbackText, ...rest }) {
  const [state, setState] = useState('loading');
  useEffect(() => { setState('loading'); }, [src]);
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-orange-50 ${className}`}>
      {state !== 'error' && src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setState('ok')}
          onError={() => setState('error')}
          className={`h-full w-full object-cover transition duration-700 ${state === 'ok' ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
          {...rest}
        />
      )}
      {state !== 'ok' && (
        <div className={`absolute inset-0 flex items-center justify-center ${state === 'loading' ? 'animate-pulse' : ''}`}>
          {state === 'error' && fallbackText && (
            <span className="font-display text-3xl font-extrabold text-gradient">{fallbackText}</span>
          )}
        </div>
      )}
    </div>
  );
}

export function Reveal({ children, delay = 0, className = '', y = 24 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, center = true, className = '' }) {
  return (
    <Reveal className={`${center ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="mt-4">{title}</h2>
      {subtitle && <p className="lead mt-4">{subtitle}</p>}
    </Reveal>
  );
}

// Inner-page header with background image and frosted overlay.
export function PageHero({ eyebrow, title, subtitle, image, children }) {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="absolute inset-0 -z-10">
        <Img src={image} className="h-full w-full" alt="" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/75 to-[var(--bg)]" />
      </div>
      <div className="container">
        <Reveal className="mx-auto max-w-3xl text-center">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="mt-5">{title}</h1>
          {subtitle && <p className="lead mx-auto mt-5 max-w-2xl">{subtitle}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}

export function Counter({ value, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value]);
  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

export function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-strong relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl p-5 sm:rounded-3xl sm:p-7 ${wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'}`}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-xl">{title}</h3>
          <button onClick={onClose} className="btn-ghost !p-2" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </motion.div>
    </div>,
    document.body
  );
}

export const Spinner = ({ className = '' }) => <Loader2 className={`h-5 w-5 animate-spin ${className}`} />;

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl bg-white/70 ${className}`} />;
}

export function Field({ label, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-muted">{hint}</span>}
    </label>
  );
}
