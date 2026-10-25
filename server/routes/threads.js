import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db.js';
import { requireAuth, validate } from '../auth.js';

// Signed-in visitors' conversations with AMS IT Services.
const router = Router();
router.use(requireAuth);

const newThread = z.object({
  subject: z.string().trim().min(2).max(160),
  body: z.string().trim().min(1).max(5000),
});
const reply = z.object({ body: z.string().trim().min(1).max(5000) });

const ownThread = (req) => db.prepare('SELECT * FROM threads WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);

router.get('/', (req, res) => {
  const threads = db.prepare(`
    SELECT t.*,
      (SELECT body FROM messages WHERE thread_id = t.id ORDER BY id DESC LIMIT 1) AS last_message,
      (SELECT COUNT(*) FROM messages WHERE thread_id = t.id AND sender_role = 'admin' AND read_by_user = 0) AS unread
    FROM threads t WHERE t.user_id = ? ORDER BY t.updated_at DESC`).all(req.user.id);
  res.json({ threads });
});

router.get('/unread', (req, res) => {
  const { n } = db.prepare(`
    SELECT COUNT(*) n FROM messages m JOIN threads t ON t.id = m.thread_id
    WHERE t.user_id = ? AND m.sender_role = 'admin' AND m.read_by_user = 0`).get(req.user.id);
  res.json({ unread: n });
});

router.post('/', validate(newThread), (req, res) => {
  const id = db.transaction(() => {
    const { lastInsertRowid } = db.prepare('INSERT INTO threads (user_id, subject) VALUES (?, ?)').run(req.user.id, req.body.subject);
    db.prepare("INSERT INTO messages (thread_id, sender_role, body, read_by_user) VALUES (?, 'user', ?, 1)").run(lastInsertRowid, req.body.body);
    return lastInsertRowid;
  })();
  res.status(201).json({ id });
});

router.get('/:id', (req, res) => {
  const thread = ownThread(req);
  if (!thread) return res.status(404).json({ error: 'Conversation not found' });
  db.prepare("UPDATE messages SET read_by_user = 1 WHERE thread_id = ? AND sender_role = 'admin'").run(thread.id);
  const messages = db.prepare('SELECT id, sender_role, body, created_at FROM messages WHERE thread_id = ? ORDER BY id').all(thread.id);
  res.json({ thread, messages });
});

router.post('/:id/messages', validate(reply), (req, res) => {
  const thread = ownThread(req);
  if (!thread) return res.status(404).json({ error: 'Conversation not found' });
  db.transaction(() => {
    db.prepare("INSERT INTO messages (thread_id, sender_role, body, read_by_user) VALUES (?, 'user', ?, 1)").run(thread.id, req.body.body);
    db.prepare("UPDATE threads SET updated_at = datetime('now'), status = 'open' WHERE id = ?").run(thread.id);
  })();
  res.status(201).json({ ok: true });
});

export default router;
