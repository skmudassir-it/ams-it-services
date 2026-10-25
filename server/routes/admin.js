import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db.js';
import { requireAdmin, validate } from '../auth.js';
import { emails, notify, sendMail, smtpConfig, verifySmtp } from '../mailer.js';

const router = Router();
router.use(requireAdmin);

const csvCell = (v) => {
  const s = v == null ? '' : String(v);
  // Neutralise spreadsheet formula injection and quote every cell.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};
const sendCsv = (res, filename, rows, columns) => {
  const lines = [columns.join(','), ...rows.map((r) => columns.map((c) => csvCell(r[c])).join(','))];
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send('﻿' + lines.join('\r\n'));
};
const like = (q) => `%${String(q || '').trim()}%`;

/* ---------- Overview ---------- */
router.get('/stats', (_req, res) => {
  const count = (sql) => db.prepare(sql).get().n;
  res.json({
    users: count("SELECT COUNT(*) n FROM users WHERE role = 'user'"),
    subscribers: count('SELECT COUNT(*) n FROM subscribers'),
    threads: count('SELECT COUNT(*) n FROM threads'),
    unread: count("SELECT COUNT(*) n FROM messages WHERE sender_role = 'user' AND read_by_admin = 0"),
    requests: count('SELECT COUNT(*) n FROM contact_requests WHERE handled = 0'),
    projects: count("SELECT COUNT(*) n FROM projects WHERE kind != 'design'"),
    posts: count('SELECT COUNT(*) n FROM posts'),
    recentUsers: db.prepare("SELECT id, name, email, created_at FROM users WHERE role = 'user' ORDER BY id DESC LIMIT 5").all(),
    recentThreads: db.prepare(`SELECT t.id, t.subject, t.updated_at, u.name,
        (SELECT COUNT(*) FROM messages WHERE thread_id = t.id AND sender_role = 'user' AND read_by_admin = 0) unread
      FROM threads t JOIN users u ON u.id = t.user_id ORDER BY t.updated_at DESC LIMIT 5`).all(),
  });
});

/* ---------- Users / email list ---------- */
router.get('/users', (req, res) => {
  const users = db.prepare(`SELECT u.id, u.name, u.email, u.phone, u.company, u.role, u.created_at, u.last_login_at, u.email_verified_at,
      (SELECT COUNT(*) FROM threads WHERE user_id = u.id) threads
    FROM users u WHERE u.name LIKE ? OR u.email LIKE ? OR IFNULL(u.company,'') LIKE ? ORDER BY u.id DESC`)
    .all(like(req.query.q), like(req.query.q), like(req.query.q));
  res.json({ users });
});

router.get('/users.csv', (_req, res) => {
  const rows = db.prepare('SELECT name, email, phone, company, role, created_at, last_login_at FROM users ORDER BY id').all();
  sendCsv(res, 'ams-users.csv', rows, ['name', 'email', 'phone', 'company', 'role', 'created_at', 'last_login_at']);
});

router.delete('/users/:id', (req, res) => {
  if (Number(req.params.id) === req.user.id) return res.status(400).json({ error: 'You cannot delete your own account' });
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

/* ---------- Email (SMTP) ---------- */
router.get('/email/status', async (_req, res) => {
  const cfg = smtpConfig();
  const check = cfg.configured ? await verifySmtp() : { ok: false, error: 'SMTP is not configured' };
  res.json({ configured: cfg.configured, host: cfg.host, port: cfg.port, secure: cfg.secure, from: cfg.from, adminTo: cfg.adminTo, ...check });
});

router.post('/email/test', validate(z.object({ to: z.string().trim().email().max(160) })), async (req, res) => {
  if (!smtpConfig().configured) return res.status(400).json({ error: 'SMTP is not configured — add the SMTP_* settings to .env' });
  try {
    await sendMail(emails.test({ to: req.body.to }));
    res.json({ ok: true });
  } catch (e) {
    res.status(502).json({ error: `Sending failed: ${e.message}` });
  }
});

/* ---------- Subscribers ---------- */
router.get('/subscribers', (req, res) => {
  res.json({ subscribers: db.prepare('SELECT * FROM subscribers WHERE email LIKE ? ORDER BY id DESC').all(like(req.query.q)) });
});

router.get('/subscribers.csv', (_req, res) => {
  sendCsv(res, 'ams-subscribers.csv', db.prepare('SELECT email, created_at FROM subscribers ORDER BY id').all(), ['email', 'created_at']);
});

router.delete('/subscribers/:id', (req, res) => {
  db.prepare('DELETE FROM subscribers WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

/* ---------- Messages (threads) ---------- */
router.get('/threads', (req, res) => {
  const status = ['open', 'closed'].includes(req.query.status) ? req.query.status : null;
  const threads = db.prepare(`SELECT t.*, u.name, u.email,
      (SELECT body FROM messages WHERE thread_id = t.id ORDER BY id DESC LIMIT 1) last_message,
      (SELECT COUNT(*) FROM messages WHERE thread_id = t.id AND sender_role = 'user' AND read_by_admin = 0) unread
    FROM threads t JOIN users u ON u.id = t.user_id
    WHERE (? IS NULL OR t.status = ?) AND (t.subject LIKE ? OR u.name LIKE ? OR u.email LIKE ?)
    ORDER BY t.updated_at DESC`).all(status, status, like(req.query.q), like(req.query.q), like(req.query.q));
  res.json({ threads });
});

router.get('/threads/:id', (req, res) => {
  const thread = db.prepare(`SELECT t.*, u.name, u.email, u.phone, u.company FROM threads t JOIN users u ON u.id = t.user_id WHERE t.id = ?`).get(req.params.id);
  if (!thread) return res.status(404).json({ error: 'Conversation not found' });
  db.prepare("UPDATE messages SET read_by_admin = 1 WHERE thread_id = ? AND sender_role = 'user'").run(thread.id);
  const messages = db.prepare('SELECT id, sender_role, body, created_at FROM messages WHERE thread_id = ? ORDER BY id').all(thread.id);
  res.json({ thread, messages });
});

router.post('/threads/:id/messages', validate(z.object({ body: z.string().trim().min(1).max(5000) })), (req, res) => {
  const thread = db.prepare('SELECT t.id, t.subject, u.name, u.email, u.lang FROM threads t JOIN users u ON u.id = t.user_id WHERE t.id = ?').get(req.params.id);
  if (!thread) return res.status(404).json({ error: 'Conversation not found' });
  db.transaction(() => {
    db.prepare("INSERT INTO messages (thread_id, sender_role, body, read_by_admin) VALUES (?, 'admin', ?, 1)").run(thread.id, req.body.body);
    db.prepare("UPDATE threads SET updated_at = datetime('now') WHERE id = ?").run(thread.id);
  })();
  notify(emails.replyToUser({ to: thread.email, name: thread.name, subject: thread.subject, body: req.body.body, lang: thread.lang }));
  res.status(201).json({ ok: true });
});

router.patch('/threads/:id', validate(z.object({ status: z.enum(['open', 'closed']) })), (req, res) => {
  db.prepare('UPDATE threads SET status = ? WHERE id = ?').run(req.body.status, req.params.id);
  res.json({ ok: true });
});

router.delete('/threads/:id', (req, res) => {
  db.prepare('DELETE FROM threads WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

/* ---------- Contact requests ---------- */
router.get('/requests', (req, res) => {
  res.json({ requests: db.prepare('SELECT * FROM contact_requests WHERE name LIKE ? OR email LIKE ? ORDER BY handled, id DESC').all(like(req.query.q), like(req.query.q)) });
});

router.patch('/requests/:id', validate(z.object({ handled: z.boolean() })), (req, res) => {
  db.prepare('UPDATE contact_requests SET handled = ? WHERE id = ?').run(req.body.handled ? 1 : 0, req.params.id);
  res.json({ ok: true });
});

router.delete('/requests/:id', (req, res) => {
  db.prepare('DELETE FROM contact_requests WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

/* ---------- Projects CMS ---------- */
const projectSchema = z.object({
  kind: z.enum(['product', 'app', 'design']),
  name: z.string().trim().min(1).max(120),
  url: z.string().trim().max(300).optional().default(''),
  category: z.string().trim().max(40).optional().default(''),
  desc_en: z.string().trim().max(1000).optional().default(''),
  desc_es: z.string().trim().max(1000).optional().default(''),
  image: z.string().trim().max(300).optional().default(''),
  featured: z.boolean().optional().default(false),
  sort: z.coerce.number().int().optional().default(0),
});
const projectParams = (b) => ({ ...b, url: b.url || null, image: b.image || null, featured: b.featured ? 1 : 0 });

router.get('/projects', (req, res) => {
  res.json({ projects: db.prepare('SELECT * FROM projects WHERE name LIKE ? ORDER BY kind, sort, id').all(like(req.query.q)) });
});

router.post('/projects', validate(projectSchema), (req, res) => {
  const info = db.prepare(`INSERT INTO projects (kind, name, url, category, desc_en, desc_es, image, featured, sort)
    VALUES (@kind, @name, @url, @category, @desc_en, @desc_es, @image, @featured, @sort)`).run(projectParams(req.body));
  res.status(201).json({ id: info.lastInsertRowid });
});

router.put('/projects/:id', validate(projectSchema), (req, res) => {
  db.prepare(`UPDATE projects SET kind=@kind, name=@name, url=@url, category=@category, desc_en=@desc_en, desc_es=@desc_es,
    image=@image, featured=@featured, sort=@sort WHERE id=@id`).run({ ...projectParams(req.body), id: req.params.id });
  res.json({ ok: true });
});

router.delete('/projects/:id', (req, res) => {
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

/* ---------- Blog posts CMS ---------- */
const postSchema = z.object({
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'use lowercase letters, numbers and dashes').max(120),
  title_en: z.string().trim().min(1).max(200),
  title_es: z.string().trim().max(200).optional().default(''),
  excerpt_en: z.string().trim().max(500).optional().default(''),
  excerpt_es: z.string().trim().max(500).optional().default(''),
  body_en: z.string().max(50000).optional().default(''),
  body_es: z.string().max(50000).optional().default(''),
  cover: z.string().trim().max(300).optional().default(''),
  published: z.boolean().optional().default(true),
  published_at: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
const postParams = (b) => ({ ...b, published: b.published ? 1 : 0, published_at: b.published_at || new Date().toISOString().slice(0, 10) });

router.get('/posts', (_req, res) => {
  res.json({ posts: db.prepare('SELECT * FROM posts ORDER BY published_at DESC, id DESC').all() });
});

router.post('/posts', validate(postSchema), (req, res) => {
  try {
    const info = db.prepare(`INSERT INTO posts (slug, title_en, title_es, excerpt_en, excerpt_es, body_en, body_es, cover, published, published_at)
      VALUES (@slug, @title_en, @title_es, @excerpt_en, @excerpt_es, @body_en, @body_es, @cover, @published, @published_at)`).run(postParams(req.body));
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (e) {
    if (String(e.message).includes('UNIQUE')) return res.status(409).json({ error: 'A post with this slug already exists' });
    throw e;
  }
});

router.put('/posts/:id', validate(postSchema), (req, res) => {
  try {
    db.prepare(`UPDATE posts SET slug=@slug, title_en=@title_en, title_es=@title_es, excerpt_en=@excerpt_en, excerpt_es=@excerpt_es,
      body_en=@body_en, body_es=@body_es, cover=@cover, published=@published, published_at=@published_at WHERE id=@id`)
      .run({ ...postParams(req.body), id: req.params.id });
    res.json({ ok: true });
  } catch (e) {
    if (String(e.message).includes('UNIQUE')) return res.status(409).json({ error: 'A post with this slug already exists' });
    throw e;
  }
});

router.delete('/posts/:id', (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
