// Outgoing email over SMTP (GoDaddy or any provider), configured entirely from environment variables.
// When SMTP isn't configured, emails are printed to the console instead so local development still works.
import nodemailer from 'nodemailer';

// Tolerates values pasted with surrounding quotes in hosting dashboards (e.g. SMTP_PASS="secret").
const env = (k, d = '') => (process.env[k] ?? d).trim().replace(/^(["'])(.*)\1$/, '$2');

export function smtpConfig() {
  const host = env('SMTP_HOST');
  const port = Number(env('SMTP_PORT', '465'));
  const user = env('SMTP_USER');
  return {
    configured: Boolean(host && user && env('SMTP_PASS')),
    host,
    port,
    // Port 465 uses implicit TLS; 587 upgrades with STARTTLS. SMTP_SECURE overrides the guess.
    secure: env('SMTP_SECURE') ? env('SMTP_SECURE') === 'true' : port === 465,
    user,
    from: env('MAIL_FROM') || user,
    fromName: env('MAIL_FROM_NAME', 'AMS IT Services'),
    adminTo: env('ADMIN_NOTIFY_EMAIL') || env('ADMIN_EMAIL') || user,
  };
}

export const siteUrl = () => env('SITE_URL', 'http://localhost:5173').replace(/\/+$/, '');

let transporter = null;
function getTransport() {
  const cfg = smtpConfig();
  if (!cfg.configured) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: { user: cfg.user, pass: env('SMTP_PASS') },
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 30_000,
    });
  }
  return transporter;
}

export async function verifySmtp() {
  const t = getTransport();
  if (!t) return { ok: false, error: 'SMTP is not configured' };
  try {
    await t.verify();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// Throws on failure — use for emails the user is waiting on (OTP codes).
export async function sendMail({ to, subject, html, text, replyTo }) {
  const cfg = smtpConfig();
  const t = getTransport();
  if (!t) {
    console.log(`\n[mail:dev] To: ${to}\n[mail:dev] Subject: ${subject}\n[mail:dev] ${text}\n`);
    return { dev: true };
  }
  return t.sendMail({ from: { name: cfg.fromName, address: cfg.from }, to, subject, html, text, replyTo });
}

// Fire-and-forget for notifications: a mail failure must never break the request that triggered it.
export function notify(message) {
  sendMail(message).catch((e) => console.error('Email failed:', message.subject, '-', e.message));
}

/* ---------------- Templates ---------------- */

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Table-based layout with inline styles so it renders in Gmail, Outlook and Apple Mail.
function layout({ heading, body, cta, footer }) {
  const url = siteUrl();
  return `<!doctype html><html><body style="margin:0;background:#f5f3ff;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ff;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 30px rgba(91,43,203,.08)">
<tr><td style="background:linear-gradient(135deg,#FF8A3D,#F23E7A 45%,#9B3FE0 75%,#5B2BCB);background-color:#9B3FE0;padding:24px 28px">
<img src="${url}/logo.jpg" width="44" height="44" alt="AMS" style="border-radius:10px;vertical-align:middle;border:2px solid rgba(255,255,255,.7)">
<span style="color:#fff;font-size:18px;font-weight:bold;vertical-align:middle;margin-left:10px">AMS IT Services</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 14px;font-size:22px;line-height:1.3">${heading}</h1>
<div style="font-size:15px;line-height:1.65;color:#334155">${body}</div>
${cta ? `<p style="margin:26px 0 4px"><a href="${cta.href}" style="display:inline-block;background:#7C3AED;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:999px">${cta.label}</a></p>` : ''}
</td></tr>
<tr><td style="padding:18px 28px;background:#faf9ff;font-size:12px;color:#64748b;line-height:1.6">${footer || 'AMS IT Services · Memphis, USA · Hyderabad, India'}<br><a href="${url}" style="color:#7C3AED">${url.replace(/^https?:\/\//, '')}</a></td></tr>
</table></td></tr></table></body></html>`;
}

const codeBox = (code) => `<div style="margin:22px 0;text-align:center"><span style="display:inline-block;font-size:32px;letter-spacing:10px;font-weight:bold;background:#f5f3ff;color:#5B2BCB;padding:14px 24px;border-radius:14px">${esc(code)}</span></div>`;

const T = {
  en: {
    verifySubject: 'Your AMS IT Services verification code',
    verifyHeading: 'Verify your email',
    verifyBody: (name) => `Hi ${esc(name)},<br>Use this code to verify your email address. It expires in 10 minutes.`,
    resetSubject: 'Your AMS IT Services password reset code',
    resetHeading: 'Reset your password',
    resetBody: (name) => `Hi ${esc(name)},<br>Use this code to reset your password. It expires in 10 minutes.`,
    ignore: 'If you didn’t request this, you can safely ignore this email.',
    replySubject: (s) => `New reply: ${s}`,
    replyHeading: 'You have a new reply',
    replyBody: (name, subject) => `Hi ${esc(name)},<br>Our team replied to your conversation <b>“${esc(subject)}”</b>:`,
    open: 'Open my messages',
    ackSubject: 'We received your request — AMS IT Services',
    ackHeading: 'Thanks for reaching out!',
    ackBody: (name, call) => `Hi ${esc(name)},<br>${call ? 'We’ve received your call request and will confirm the time shortly.' : 'We’ve received your message and will get back to you within 24 hours.'} Every project includes a free business strategy consultation.`,
  },
  es: {
    verifySubject: 'Su código de verificación de AMS IT Services',
    verifyHeading: 'Verifique su correo',
    verifyBody: (name) => `Hola ${esc(name)},<br>Use este código para verificar su correo electrónico. Vence en 10 minutos.`,
    resetSubject: 'Su código para restablecer la contraseña de AMS IT Services',
    resetHeading: 'Restablezca su contraseña',
    resetBody: (name) => `Hola ${esc(name)},<br>Use este código para restablecer su contraseña. Vence en 10 minutos.`,
    ignore: 'Si no solicitó esto, puede ignorar este correo.',
    replySubject: (s) => `Nueva respuesta: ${s}`,
    replyHeading: 'Tiene una nueva respuesta',
    replyBody: (name, subject) => `Hola ${esc(name)},<br>Nuestro equipo respondió a su conversación <b>“${esc(subject)}”</b>:`,
    open: 'Abrir mis mensajes',
    ackSubject: 'Recibimos su solicitud — AMS IT Services',
    ackHeading: '¡Gracias por escribirnos!',
    ackBody: (name, call) => `Hola ${esc(name)},<br>${call ? 'Recibimos su solicitud de llamada y confirmaremos el horario en breve.' : 'Recibimos su mensaje y le responderemos en menos de 24 horas.'} Cada proyecto incluye una consulta gratuita de estrategia empresarial.`,
  },
};
const tr = (lang) => T[lang === 'es' ? 'es' : 'en'];
const quote = (text) => `<blockquote style="margin:16px 0;padding:12px 16px;background:#f8fafc;border-left:4px solid #9B3FE0;border-radius:8px;white-space:pre-wrap">${esc(text)}</blockquote>`;

export const emails = {
  otp({ to, name, code, purpose, lang }) {
    const t = tr(lang);
    const reset = purpose === 'reset';
    return {
      to,
      subject: reset ? t.resetSubject : t.verifySubject,
      html: layout({ heading: reset ? t.resetHeading : t.verifyHeading, body: (reset ? t.resetBody(name) : t.verifyBody(name)) + codeBox(code) + t.ignore }),
      text: `${reset ? t.resetHeading : t.verifyHeading}: ${code} (10 min). ${t.ignore}`,
    };
  },

  replyToUser({ to, name, subject, body, lang }) {
    const t = tr(lang);
    return {
      to,
      subject: t.replySubject(subject),
      html: layout({ heading: t.replyHeading, body: t.replyBody(name, subject) + quote(body), cta: { href: `${siteUrl()}/dashboard`, label: t.open } }),
      text: `${t.replyHeading}\n\n${body}\n\n${siteUrl()}/dashboard`,
    };
  },

  contactAck({ to, name, type, lang }) {
    const t = tr(lang);
    return {
      to,
      subject: t.ackSubject,
      html: layout({ heading: t.ackHeading, body: t.ackBody(name, type === 'call') }),
      text: `${t.ackHeading}\n${t.ackBody(name, type === 'call').replace(/<[^>]+>/g, ' ')}`,
    };
  },

  // Admin notifications are always in English.
  adminContact(r) {
    const rows = [['Type', r.type === 'call' ? 'Call request' : 'Quote / message'], ['Name', r.name], ['Email', r.email], ['Phone', r.phone],
      ...(r.type === 'call' ? [['Preferred', `${r.date} ${r.time}`]] : [])].filter(([, v]) => v);
    return {
      to: smtpConfig().adminTo,
      replyTo: r.email,
      subject: `New ${r.type === 'call' ? 'call request' : 'quote request'} from ${r.name}`,
      html: layout({
        heading: r.type === 'call' ? 'New call request' : 'New quote request',
        body: `<table style="font-size:14px">${rows.map(([k, v]) => `<tr><td style="padding:2px 12px 2px 0;color:#64748b">${k}</td><td><b>${esc(v)}</b></td></tr>`).join('')}</table>${r.message ? quote(r.message) : ''}`,
        cta: { href: `${siteUrl()}/admin/requests`, label: 'Open in admin' },
        footer: 'Reply to this email to answer the visitor directly.',
      }),
      text: rows.map(([k, v]) => `${k}: ${v}`).join('\n') + (r.message ? `\n\n${r.message}` : ''),
    };
  },

  adminMessage({ threadId, subject, name, email, body, isNew }) {
    return {
      to: smtpConfig().adminTo,
      replyTo: email,
      subject: `${isNew ? 'New conversation' : 'New message'}: ${subject} — ${name}`,
      html: layout({
        heading: isNew ? 'New conversation from a visitor' : 'New message in a conversation',
        body: `<b>${esc(name)}</b> (${esc(email)}) wrote in <b>“${esc(subject)}”</b>:${quote(body)}`,
        cta: { href: `${siteUrl()}/admin/messages?thread=${threadId}`, label: 'Reply in admin' },
      }),
      text: `${name} <${email}> — ${subject}\n\n${body}\n\n${siteUrl()}/admin/messages?thread=${threadId}`,
    };
  },

  test({ to }) {
    return {
      to,
      subject: 'SMTP test — AMS IT Services',
      html: layout({ heading: 'Email is working 🎉', body: 'This test email confirms your SMTP settings are correct. Verification codes, password resets and notifications will be delivered from this address.' }),
      text: 'This test email confirms your SMTP settings are correct.',
    };
  },
};
