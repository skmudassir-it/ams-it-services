import jwt from 'jsonwebtoken';
import { db } from './db.js';

const COOKIE = 'ams_session';
const secret = () => process.env.JWT_SECRET || 'dev-only-secret-change-me';

export function issueSession(res, user) {
  const token = jwt.sign({ sub: user.id, role: user.role }, secret(), { expiresIn: '7d' });
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    // HTTPS-only in production; COOKIE_SECURE=false allows testing over plain http (e.g. before a domain is attached).
    secure: process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearSession(res) {
  res.clearCookie(COOKIE);
}

export const publicUser = (u) => u && {
  id: u.id, name: u.name, email: u.email, role: u.role, phone: u.phone, company: u.company, created_at: u.created_at,
  email_verified: Boolean(u.email_verified_at),
};

// Attaches req.user when a valid session cookie is present.
export function loadUser(req, _res, next) {
  const token = req.cookies?.[COOKIE];
  if (token) {
    try {
      const { sub } = jwt.verify(token, secret());
      req.user = db.prepare('SELECT * FROM users WHERE id = ?').get(sub) || null;
    } catch {
      req.user = null;
    }
  }
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Not signed in' });
  next();
}

export function requireVerified(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Not signed in' });
  if (!req.user.email_verified_at) return res.status(403).json({ error: 'Please verify your email first', code: 'email_unverified' });
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Not signed in' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}

// Wraps a zod schema into middleware that replaces req.body with the parsed value.
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const issue = result.error.issues[0];
    return res.status(400).json({ error: `${issue.path.join('.') || 'input'}: ${issue.message}` });
  }
  req.body = result.data;
  next();
};
