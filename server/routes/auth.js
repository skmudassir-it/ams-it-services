import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '../db.js';
import { issueSession, clearSession, publicUser, requireAuth, validate } from '../auth.js';
import { checkOtp, issueOtp, OtpError } from '../otp.js';
import { emails, sendMail } from '../mailer.js';

const router = Router();

async function sendCode(user, purpose, lang) {
  const code = issueOtp(user.email, purpose);
  await sendMail(emails.otp({ to: user.email, name: user.name, code, purpose, lang }));
}

const otpFailure = (res, err) => {
  if (err instanceof OtpError) return res.status(err.status).json({ error: err.message, code: err.code });
  console.error('OTP email failed:', err.message);
  return res.status(502).json({ error: 'We couldn’t send the email right now. Please try again shortly.', code: 'email_failed' });
};

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(160),
  password: z.string().min(8).max(128),
  phone: z.string().trim().max(40).optional().default(''),
  company: z.string().trim().max(120).optional().default(''),
  lang: z.enum(['en', 'es']).optional().default('en'),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(128),
});

router.post('/register', validate(registerSchema), async (req, res) => {
  const { name, email, password, phone, company, lang } = req.body;
  if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }
  const info = db
    .prepare('INSERT INTO users (name, email, password_hash, phone, company, lang, last_login_at) VALUES (?, ?, ?, ?, ?, ?, datetime(\'now\'))')
    .run(name, email, bcrypt.hashSync(password, 12), phone || null, company || null, lang);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  issueSession(res, user);
  // The account exists either way; if the code email fails the user can resend it from the verify page.
  const emailSent = await sendCode(user, 'verify', lang).then(() => true, () => false);
  res.status(201).json({ user: publicUser(user), emailSent });
});

router.post('/login', validate(loginSchema), (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(req.body.email);
  if (!user || !bcrypt.compareSync(req.body.password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  db.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").run(user.id);
  issueSession(res, user);
  res.json({ user: publicUser(user) });
});

router.post('/logout', (_req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  res.json({ user: publicUser(req.user) || null });
});

/* ---------- Email verification ---------- */
const langSchema = z.object({ lang: z.enum(['en', 'es']).optional().default('en') });
const codeSchema = z.object({ code: z.string().trim().regex(/^\d{6}$/, 'enter the 6-digit code') });

router.post('/verify/send', requireAuth, validate(langSchema), async (req, res) => {
  if (req.user.email_verified_at) return res.json({ ok: true, alreadyVerified: true });
  try {
    await sendCode(req.user, 'verify', req.body.lang);
    res.json({ ok: true });
  } catch (err) {
    otpFailure(res, err);
  }
});

router.post('/verify', requireAuth, validate(codeSchema), (req, res) => {
  if (!req.user.email_verified_at) {
    try {
      checkOtp(req.user.email, 'verify', req.body.code);
    } catch (err) {
      return otpFailure(res, err);
    }
    db.prepare("UPDATE users SET email_verified_at = datetime('now') WHERE id = ?").run(req.user.id);
  }
  res.json({ user: publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)) });
});

/* ---------- Password reset ---------- */
const forgotSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(160),
  lang: z.enum(['en', 'es']).optional().default('en'),
});
const resetSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(160),
  code: z.string().trim().regex(/^\d{6}$/, 'enter the 6-digit code'),
  password: z.string().min(8).max(128),
});

// Always answers the same way so the form can't be used to discover which emails have accounts.
router.post('/password/forgot', validate(forgotSchema), async (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(req.body.email);
  if (user) {
    try {
      await sendCode(user, 'reset', req.body.lang);
    } catch (err) {
      return otpFailure(res, err);
    }
  }
  res.json({ ok: true });
});

router.post('/password/reset', validate(resetSchema), (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(req.body.email);
  try {
    if (!user) throw new OtpError('otp_invalid', 'Incorrect code');
    checkOtp(user.email, 'reset', req.body.code);
  } catch (err) {
    return otpFailure(res, err);
  }
  // Receiving the code proves ownership of the inbox, so the email also counts as verified.
  db.prepare(`UPDATE users SET password_hash = ?, email_verified_at = COALESCE(email_verified_at, datetime('now')),
    last_login_at = datetime('now') WHERE id = ?`).run(bcrypt.hashSync(req.body.password, 12), user.id);
  const fresh = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
  issueSession(res, fresh);
  res.json({ user: publicUser(fresh) });
});

const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().max(40).optional().default(''),
  company: z.string().trim().max(120).optional().default(''),
});

router.put('/me', requireAuth, validate(profileSchema), (req, res) => {
  const { name, phone, company } = req.body;
  db.prepare('UPDATE users SET name = ?, phone = ?, company = ? WHERE id = ?').run(name, phone || null, company || null, req.user.id);
  res.json({ user: publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)) });
});

export default router;
