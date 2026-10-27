import { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import { useLocalized } from '../i18n';

const STORAGE_KEY = 'ams-chat';
const load = () => {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
};

// Turns site paths ("/contact") and URLs in bot replies into links.
function RichText({ text }) {
  const parts = text.split(/(https?:\/\/[^\s),]+|(?<![\w.])\/(?:services|projects|portfolio|amserp|dockpass|about|blog|contact|register|login|dashboard)[\w\-/]*)/g);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      const clean = part.replace(/[.!?]+$/, '');
      return <Fragment key={i}><a href={clean} target="_blank" rel="noreferrer" className="font-semibold text-brand-indigo underline">{clean.replace(/^https?:\/\//, '')}</a>{part.slice(clean.length)}</Fragment>;
    }
    if (/^\/[a-z]/.test(part)) {
      const clean = part.replace(/[.!?]+$/, '');
      return <Fragment key={i}><Link to={clean} className="font-semibold text-brand-indigo underline">{clean}</Link>{part.slice(clean.length)}</Fragment>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export default function ChatBot() {
  const { t } = useTranslation();
  const { lang } = useLocalized();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(load);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30))); } catch {}
  }, [messages]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, open]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const send = async (text) => {
    const content = text.trim();
    if (!content || busy) return;
    const history = [...messages, { role: 'user', content }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang, messages: history.filter((m) => m.content) }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t('chatbot.error'));
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages([...history, { role: 'assistant', content: reply }]);
      }
      if (!reply) setMessages([...history, { role: 'assistant', content: t('chatbot.error') }]);
    } catch (e) {
      setMessages([...history, { role: 'assistant', content: e.message || t('chatbot.error') }]);
    } finally {
      setBusy(false);
    }
  };

  const suggestions = t('chatbot.suggestions', { returnObjects: true });

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="glass-strong fixed inset-x-2 bottom-2 top-16 z-[60] flex flex-col overflow-hidden rounded-3xl shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-5 sm:top-auto sm:h-[600px] sm:max-h-[calc(100vh-8rem)] sm:w-[400px]"
            aria-label={t('chatbot.title')}
          >
            <header className="flex items-center gap-3 bg-brand-gradient px-4 py-3 text-white">
              <span className="relative">
                <img src="/logo.jpg" alt="" className="h-10 w-10 rounded-xl border-2 border-white/70 object-cover" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold leading-tight">{t('chatbot.title')}</p>
                <p className="text-xs text-white/85">{t('chatbot.subtitle')}</p>
              </div>
              {messages.length > 0 && (
                <button onClick={() => setMessages([])} className="rounded-full p-2 hover:bg-white/15" aria-label={t('chatbot.reset')} title={t('chatbot.reset')}>
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-white/15" aria-label={t('common.cancel')}>
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
              <div className="flex gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white"><Sparkles className="h-3.5 w-3.5" /></span>
                <div className="rounded-2xl rounded-tl-md bg-white px-4 py-2.5 text-sm leading-relaxed text-ink shadow-sm">{t('chatbot.greeting')}</div>
              </div>
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pl-9">
                  {suggestions.map((s) => (
                    <button key={s} onClick={() => send(s)} className="rounded-full border border-brand-violet/20 bg-white/80 px-3 py-1.5 text-xs font-medium text-brand-indigo transition hover:bg-brand-50">
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((m, i) => (m.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-brand-gradient px-4 py-2.5 text-sm text-white shadow-sm">{m.content}</div>
                </div>
              ) : (
                <div key={i} className="flex gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white"><Sparkles className="h-3.5 w-3.5" /></span>
                  <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-tl-md bg-white px-4 py-2.5 text-sm leading-relaxed text-ink shadow-sm">
                    {m.content ? <RichText text={m.content} /> : (
                      <span className="flex gap-1 py-1.5" aria-label={t('common.loading')}>
                        {[0, 1, 2].map((d) => <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-brand-violet/60" style={{ animationDelay: `${d * 0.15}s` }} />)}
                      </span>
                    )}
                  </div>
                </div>
              )))}
              <div ref={endRef} />
            </div>

            <div className="border-t border-white/80 bg-white/50 p-3">
              <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
                  placeholder={t('chatbot.placeholder')}
                  rows={1}
                  maxLength={2000}
                  className="input max-h-32 min-h-[44px] flex-1 resize-none"
                  aria-label={t('chatbot.placeholder')}
                />
                <button className="btn-primary !h-11 !w-11 !p-0" disabled={busy || !input.trim()} aria-label={t('dashboard.send')}>
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <p className="mt-2 text-center text-[11px] text-ink-muted">
                {t('chatbot.human')} <Link to="/contact" onClick={() => setOpen(false)} className="font-semibold text-brand-indigo hover:underline">{t('nav.contact')}</Link>
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-4 right-4 z-[60] h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-white shadow-xl shadow-brand-violet/30 sm:bottom-5 sm:right-5 ${open ? 'hidden sm:flex' : 'flex'}`}
        aria-label={open ? t('common.cancel') : t('chatbot.open')}
        aria-expanded={open}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && messages.length === 0 && <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-white bg-emerald-400" />}
      </motion.button>
    </>
  );
}
