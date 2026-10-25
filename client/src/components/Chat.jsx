import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { formatDate } from '../lib/api';
import { useLocalized } from '../i18n';
import { Spinner } from './ui';

// Conversation view shared by the customer dashboard and the admin inbox.
// `mine` is the sender_role whose bubbles appear on the right.
export function ChatMessages({ messages, mine, labels }) {
  const { lang } = useLocalized();
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages?.length]);
  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
      {messages?.map((m) => {
        const own = m.sender_role === mine;
        return (
          <div key={m.id} className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] sm:max-w-[75%] ${own ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${own ? 'rounded-br-md bg-brand-gradient text-white' : 'rounded-bl-md bg-white text-ink'}`}>
                {m.body}
              </div>
              <span className="mt-1 px-1 text-[11px] text-ink-muted">{labels[m.sender_role]} · {formatDate(m.created_at, lang, true)}</span>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}

export function ChatComposer({ onSend, disabled }) {
  const { t } = useTranslation();
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    try {
      await onSend(body.trim());
      setBody('');
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="flex items-end gap-2 border-t border-white/80 bg-white/50 p-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) submit(e); }}
        placeholder={t('dashboard.reply')}
        rows={1}
        maxLength={5000}
        disabled={disabled}
        className="input max-h-40 min-h-[44px] flex-1 resize-none"
        aria-label={t('dashboard.reply')}
      />
      <button className="btn-primary !h-11 !w-11 !p-0" disabled={busy || disabled || !body.trim()} aria-label={t('dashboard.send')}>
        {busy ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />}
      </button>
    </form>
  );
}
