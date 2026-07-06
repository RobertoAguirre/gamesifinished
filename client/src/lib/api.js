import { getToken } from './stores/auth.js';

const BASE = '/api';

async function request(path, options = {}) {
  const token = await getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(BASE + path, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Error ${res.status}`);
  }

  return res.status === 204 ? null : res.json();
}

export const api = {
  searchGames: (q) => request(`/games/search?q=${encodeURIComponent(q)}`),
  getFeed: () => request('/entries'),
  getMine: () => request('/entries/mine'),
  createEntry: (data) => request('/entries', { method: 'POST', body: JSON.stringify(data) }),
  deleteEntry: (id) => request(`/entries/${id}`, { method: 'DELETE' }),
};
