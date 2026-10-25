// One-time 6-digit codes for email verification and password resets.
// Codes are stored hashed, expire after 10 minutes, allow 5 attempts, and a new code replaces older ones.
import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import { db } from './db.js';

const TTL_MIN = 10;
const MAX_ATTEMPTS = 5;
const RESEND_SECONDS = 60;
const MAX_PER_HOUR = 5;

const hash = (email, purpose, code) =>
  createHmac('sha256', process.env.JWT_SECRET || 'dev-only-secret-change-me').update(`${email.toLowerCase()}|${purpose}|${code}`).digest('hex');

export class OtpError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function issueOtp(email, purpose) {
  const recent = db.prepare(`SELECT
      (SELECT COUNT(*) FROM otp_codes WHERE email = ? AND purpose = ? AND created_at > datetime('now', '-1 hour')) AS hourly,
      (SELECT MAX(created_at) FROM otp_codes WHERE email = ? AND purpose = ?) AS last`).get(email, purpose, email, purpose);
  if (recent.last && Date.now() - Date.parse(recent.last.replace(' ', 'T') + 'Z') < RESEND_SECONDS * 1000) {
    throw new OtpError('otp_wait', `Please wait ${RESEND_SECONDS} seconds before requesting another code`, 429);
  }
  if (recent.hourly >= MAX_PER_HOUR) throw new OtpError('otp_limit', 'Too many codes requested — please try again in an hour', 429);

  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  db.transaction(() => {
    db.prepare("UPDATE otp_codes SET consumed_at = datetime('now') WHERE email = ? AND purpose = ? AND consumed_at IS NULL").run(email, purpose);
    db.prepare(`INSERT INTO otp_codes (email, purpose, code_hash, expires_at) VALUES (?, ?, ?, datetime('now', '+${TTL_MIN} minutes'))`)
      .run(email, purpose, hash(email, purpose, code));
  })();
  return code;
}

// Consumes the code on success; throws OtpError otherwise.
export function checkOtp(email, purpose, code) {
  const row = db.prepare(`SELECT * FROM otp_codes WHERE email = ? AND purpose = ? AND consumed_at IS NULL
    AND expires_at > datetime('now') ORDER BY id DESC LIMIT 1`).get(email, purpose);
  if (!row) throw new OtpError('otp_expired', 'This code has expired — request a new one');
  if (row.attempts >= MAX_ATTEMPTS) throw new OtpError('otp_locked', 'Too many wrong attempts — request a new code');

  const expected = Buffer.from(row.code_hash, 'hex');
  const actual = Buffer.from(hash(email, purpose, String(code).trim()), 'hex');
  if (!timingSafeEqual(expected, actual)) {
    db.prepare('UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?').run(row.id);
    throw new OtpError('otp_invalid', 'Incorrect code');
  }
  db.prepare("UPDATE otp_codes SET consumed_at = datetime('now') WHERE id = ?").run(row.id);
}
