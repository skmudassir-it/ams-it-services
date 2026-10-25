import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { apps as legacyApps, featuredApps, designs, posts } from './seed-data.js';

// The live sites hosted on *.amsitservices.com (name, category, EN/ES descriptions).
const hostedApps = JSON.parse(readFileSync(new URL('./projects-data.json', import.meta.url), 'utf8'));

// DB_PATH lets containers keep the database on a mounted volume.
const dbPath = process.env.DB_PATH || join(dirname(fileURLToPath(import.meta.url)), 'data', 'app.db');
mkdirSync(dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  phone TEXT,
  company TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT
);
CREATE TABLE IF NOT EXISTS threads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  thread_id INTEGER NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('user','admin')),
  body TEXT NOT NULL,
  read_by_admin INTEGER NOT NULL DEFAULT 0,
  read_by_user INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);
CREATE TABLE IF NOT EXISTS contact_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL DEFAULT 'quote' CHECK (type IN ('quote','call')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  date TEXT,
  time TEXT,
  handled INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL DEFAULT 'app' CHECK (kind IN ('product','app','design')),
  name TEXT NOT NULL,
  url TEXT,
  category TEXT,
  desc_en TEXT,
  desc_es TEXT,
  image TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  sort INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL,
  title_es TEXT,
  excerpt_en TEXT,
  excerpt_es TEXT,
  body_en TEXT,
  body_es TEXT,
  cover TEXT,
  published INTEGER NOT NULL DEFAULT 1,
  published_at TEXT NOT NULL DEFAULT (date('now'))
);
`);

const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function seed() {
  if (db.prepare('SELECT COUNT(*) n FROM projects').get().n === 0) {
    const insert = db.prepare(`INSERT INTO projects (kind, name, url, category, desc_en, desc_es, image, featured, sort)
      VALUES (@kind, @name, @url, @category, @desc_en, @desc_es, @image, @featured, @sort)`);
    db.transaction(() => {
      insert.run({
        kind: 'product', name: 'DockPass', url: 'https://dockpass.org', category: 'saas',
        desc_en: 'Pickup verification for warehouses — live ID checks, single-use QR passes and a full audit trail.',
        desc_es: 'Verificación de recogidas para almacenes: validación de identidad en vivo, pases QR de un solo uso y auditoría completa.',
        image: '/dockpass/dock.webp', featured: 1, sort: 0,
      });
      designs.forEach((name, i) =>
        insert.run({ kind: 'design', name, url: null, category: 'ecommerce', desc_en: 'E-commerce store design', desc_es: 'Diseño de tienda en línea', image: `/portfolio/${slugify(name)}.jpg`, featured: 0, sort: i + 1 }));
    })();
  }

  if (db.prepare('SELECT COUNT(*) n FROM posts').get().n === 0) {
    const insert = db.prepare(`INSERT INTO posts (slug, title_en, title_es, excerpt_en, excerpt_es, body_en, body_es, cover, published_at)
      VALUES (@slug, @title_en, @title_es, @excerpt_en, @excerpt_es, @body_en, @body_es, @cover, @published_at)`);
    db.transaction(() => posts.forEach((p) => insert.run(p)))();
  }

  // v1: hosted apps moved from the old vercel.app list to the 154 *.amsitservices.com sites.
  // Removes only the old seeded rows; projects added in the admin are kept.
  if (db.pragma('user_version', { simple: true }) < 1) {
    db.transaction(() => {
      const remove = db.prepare("DELETE FROM projects WHERE kind = 'app' AND url = ?");
      legacyApps.forEach(([, url]) => remove.run(url));
      const exists = db.prepare('SELECT 1 FROM projects WHERE url = ?');
      const insert = db.prepare(`INSERT INTO projects (kind, name, url, category, desc_en, desc_es, featured, sort)
        VALUES ('app', @name, @url, @category, @desc_en, @desc_es, @featured, @sort)`);
      hostedApps.forEach((p, i) => {
        if (!exists.get(p.url)) insert.run({ ...p, featured: featuredApps.includes(p.url) ? 1 : 0, sort: i + 1 });
      });
      db.pragma('user_version = 1');
    })();
  }

  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
  if (ADMIN_EMAIL && ADMIN_PASSWORD && !db.prepare('SELECT 1 FROM users WHERE email = ?').get(ADMIN_EMAIL)) {
    db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')")
      .run(ADMIN_NAME || 'Administrator', ADMIN_EMAIL, bcrypt.hashSync(ADMIN_PASSWORD, 12));
    console.log(`Seeded admin account ${ADMIN_EMAIL}`);
  }
}

seed();
