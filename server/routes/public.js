import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db.js';
import { validate } from '../auth.js';

const router = Router();

router.get('/projects', (req, res) => {
  const where = [];
  const params = [];
  if (req.query.kind) { where.push('kind = ?'); params.push(String(req.query.kind)); }
  if (req.query.category) { where.push('category = ?'); params.push(String(req.query.category)); }
  if (req.query.featured) where.push('featured = 1');
  const sql = `SELECT id, kind, name, url, category, desc_en, desc_es, image, featured FROM projects
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY sort, id`;
  res.json({ projects: db.prepare(sql).all(...params) });
});

router.get('/posts', (_req, res) => {
  const posts = db.prepare(`SELECT id, slug, title_en, title_es, excerpt_en, excerpt_es, cover, published_at
    FROM posts WHERE published = 1 ORDER BY published_at DESC, id DESC`).all();
  res.json({ posts });
});

router.get('/posts/:slug', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE slug = ? AND published = 1').get(req.params.slug);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json({ post });
});

const contactSchema = z.object({
  type: z.enum(['quote', 'call']).default('quote'),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(160),
  phone: z.string().trim().max(40).optional().default(''),
  message: z.string().trim().max(5000).optional().default(''),
  date: z.string().trim().max(20).optional().default(''),
  time: z.string().trim().max(20).optional().default(''),
}).refine((d) => d.type === 'call' || d.message.length > 0, { message: 'Message is required', path: ['message'] })
  .refine((d) => d.type === 'quote' || (d.phone && d.date && d.time), { message: 'Phone, date and time are required', path: ['date'] });

router.post('/contact', validate(contactSchema), (req, res) => {
  const { type, name, email, phone, message, date, time } = req.body;
  db.prepare('INSERT INTO contact_requests (type, name, email, phone, message, date, time) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(type, name, email, phone || null, message || null, date || null, time || null);
  res.status(201).json({ ok: true });
});

router.post('/subscribe', validate(z.object({ email: z.string().trim().toLowerCase().email().max(160) })), (req, res) => {
  db.prepare('INSERT OR IGNORE INTO subscribers (email) VALUES (?)').run(req.body.email);
  res.status(201).json({ ok: true });
});

export default router;
