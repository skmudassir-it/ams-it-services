// Thin fetch wrapper: sends the session cookie, parses JSON and throws readable errors.
async function request(method, url, body) {
  const res = await fetch(`/api${url}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  get: (url) => request('GET', url),
  post: (url, body) => request('POST', url, body ?? {}),
  put: (url, body) => request('PUT', url, body),
  patch: (url, body) => request('PATCH', url, body),
  del: (url) => request('DELETE', url),
};

export const formatDate = (iso, lang = 'en', withTime = false) => {
  if (!iso) return '';
  // SQLite stores UTC as "YYYY-MM-DD HH:MM:SS" without a zone marker.
  const d = new Date(iso.length > 10 ? iso.replace(' ', 'T') + 'Z' : iso + 'T00:00:00');
  return d.toLocaleString(lang === 'es' ? 'es-ES' : 'en-US', withTime
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'medium' });
};
