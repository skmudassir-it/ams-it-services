import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { validate } from '../auth.js';
import { faqAnswer, systemPrompt } from '../chat-knowledge.js';

// Website chat assistant. Streams the reply as plain text using, in order of preference:
//   1. an OpenAI-compatible gateway (CHAT_BASE_URL + CHAT_API_KEY, model CHAT_MODEL, default "auto")
//   2. Claude via the Anthropic SDK (ANTHROPIC_API_KEY)
//   3. built-in FAQ answers — also used whenever a provider fails before any text is sent
const router = Router();

const gateway = () => {
  const base = process.env.CHAT_BASE_URL;
  const key = process.env.CHAT_API_KEY;
  return base && key ? { base: base.replace(/\/+$/, ''), key, model: process.env.CHAT_MODEL || 'auto' } : null;
};

let anthropic = null;
let anthropicDisabled = !process.env.ANTHROPIC_API_KEY;
function getAnthropic() {
  if (anthropicDisabled) return null;
  if (!anthropic) {
    try {
      anthropic = new Anthropic();
    } catch {
      anthropicDisabled = true;
      return null;
    }
  }
  return anthropic;
}

const chatSchema = z.object({
  lang: z.enum(['en', 'es']).default('en'),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().trim().min(1).max(2000),
  })).min(1).max(30),
});

// Some routed models inline their reasoning in <think> tags; visitors should only see the answer.
function createThinkFilter() {
  let inThink = false;
  let pending = '';
  const push = (chunk) => {
    pending += chunk;
    let out = '';
    for (;;) {
      if (inThink) {
        const end = pending.indexOf('</think>');
        if (end === -1) { pending = pending.slice(-7); return out; }
        pending = pending.slice(end + 8).replace(/^\s+/, '');
        inThink = false;
      } else {
        const start = pending.indexOf('<think>');
        if (start === -1) {
          // Hold back a possible partial "<think" tag at the end of the chunk.
          const keep = pending.lastIndexOf('<');
          const safe = keep !== -1 && '<think>'.startsWith(pending.slice(keep)) ? keep : pending.length;
          out += pending.slice(0, safe);
          pending = pending.slice(safe);
          return out;
        }
        out += pending.slice(0, start);
        pending = pending.slice(start + 7);
        inThink = true;
      }
    }
  };
  const flush = () => (inThink ? '' : pending);
  return { push, flush };
}

async function streamFromGateway({ base, key, model }, history, write, signal) {
  const res = await fetch(`${base}/v1/chat/completions`, {
    method: 'POST',
    signal,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: true,
      max_tokens: 1200,
      messages: [{ role: 'system', content: systemPrompt() }, ...history],
    }),
  });
  if (!res.ok || !res.body) throw new Error(`Gateway HTTP ${res.status}: ${(await res.text().catch(() => '')).slice(0, 200)}`);

  const filter = createThinkFilter();
  const decoder = new TextDecoder();
  let buffer = '';
  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      const data = line.replace(/^data:\s*/, '').trim();
      if (!line.startsWith('data:') || !data || data === '[DONE]') continue;
      let event;
      try { event = JSON.parse(data); } catch { continue; }
      if (event.error) throw new Error(`Gateway error: ${JSON.stringify(event.error).slice(0, 200)}`);
      // Only `content` is the answer; `reasoning` deltas are the model's private thinking.
      const text = event.choices?.[0]?.delta?.content;
      if (text) write(filter.push(text));
    }
  }
  write(filter.flush());
}

async function streamFromClaude(client, history, write, signal) {
  const stream = client.beta.messages.stream({
    model: process.env.ANTHROPIC_CHAT_MODEL || 'claude-opus-5-5',
    max_tokens: 2000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'low' },
    system: [{ type: 'text', text: systemPrompt(), cache_control: { type: 'ephemeral' } }],
    messages: history,
  }, { signal });
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') write(event.delta.text);
  }
  const final = await stream.finalMessage();
  if (final.stop_reason === 'refusal') throw new Error('Claude declined the request');
}

router.post('/', validate(chatSchema), async (req, res) => {
  const { lang } = req.body;
  // Keep the latest turns only, and make sure the history starts with a user turn.
  let history = req.body.messages.slice(-16);
  while (history.length && history[0].role !== 'user') history = history.slice(1);
  const last = history[history.length - 1];
  if (!last || last.role !== 'user') return res.status(400).json({ error: 'The last message must be from the user' });

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');

  const controller = new AbortController();
  res.on('close', () => { if (!res.writableEnded) controller.abort(); });

  let wrote = false;
  const write = (chunk) => {
    const text = wrote ? chunk : chunk?.replace(/^\s+/, ''); // drop leading blank lines
    if (!text) return;
    res.write(text);
    wrote = true;
  };

  const gw = gateway();
  const claude = gw ? null : getAnthropic();
  res.setHeader('X-Chat-Mode', gw ? 'gateway' : claude ? 'claude' : 'faq');

  try {
    if (gw) await streamFromGateway(gw, history, write, controller.signal);
    else if (claude) await streamFromClaude(claude, history, write, controller.signal);
  } catch (err) {
    if (controller.signal.aborted) return;
    if (err instanceof Anthropic.AuthenticationError) anthropicDisabled = true;
    console.error('Chat assistant error:', err.message);
  }
  if (!wrote) res.write(faqAnswer(last.content, lang));
  res.end();
});

export default router;
