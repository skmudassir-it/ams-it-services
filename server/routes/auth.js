import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '../db.js';
import { issueSession, clearSession, publicUser, requireAuth, validate } from '../auth.js';

const router = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(160),
  password: z.string().min(8).max(128),
  phone: z.string().trim().max(40).optional().default(''),
  company: z.string().trim().max(120).optional().default(''),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(128),
});

router.post('/register', validate(registerSchema), (req, res) => {
  const { name, email, password, phone, company } = req.body;
  if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }
  const info = db
    .prepare('INSERT INTO users (name, email, password_hash, phone, company, last_login_at) VALUES (?, ?, ?, ?, ?, datetime(\'now\'))')
    .run(name, email, bcrypt.hashSync(password, 12), phone || null, company || null);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  issueSession(res, user);
  res.status(201).json({ user: publicUser(user) });
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
