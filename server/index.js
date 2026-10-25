import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import './db.js';
import { loadUser } from './auth.js';
import authRoutes from './routes/auth.js';
import threadRoutes from './routes/threads.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';
import chatRoutes from './routes/chat.js';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('JWT_SECRET must be set in production');
  process.exit(1);
}

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'client', 'dist');

app.set('trust proxy', 1);
// gzip/brotli for text payloads — the JS bundle is ~470KB raw vs ~140KB compressed.
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': ["'self'", 'data:', 'https://images.unsplash.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    },
  },
}));
app.use(express.json({ limit: '200kb' }));
app.use(cookieParser());
app.use(loadUser);

const strictLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false });
const writeLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false });

app.use('/api/auth/login', strictLimit);
app.use('/api/auth/register', strictLimit);
app.use(['/api/contact', '/api/subscribe'], writeLimit);
// Each chat message is a paid model call, so cap it per visitor.
app.use('/api/chat', rateLimit({ windowMs: 10 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many messages — please try again in a few minutes.' } }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', publicRoutes);
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

if (existsSync(distDir)) {
  // redirect:false so SPA routes like /dockpass and /portfolio aren't hijacked by same-named asset folders.
  app.use(express.static(distDir, { maxAge: '7d', index: false, redirect: false }));
  app.get('*', (_req, res) => res.sendFile(join(distDir, 'index.html')));
}

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => console.log(`AMS IT Services API listening on http://localhost:${PORT}`));
