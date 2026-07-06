import { Router } from 'express';

const router = Router();

router.get('/search', async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  if (!q) return res.json([]);

  const url = new URL('https://api.rawg.io/api/games');
  url.searchParams.set('search', q);
  url.searchParams.set('key', process.env.RAWG_API_KEY);
  url.searchParams.set('page_size', '8');

  const rawgRes = await fetch(url);
  if (!rawgRes.ok) {
    return res.status(502).json({ error: 'No se pudo buscar el juego' });
  }

  const data = await rawgRes.json();
  const games = (data.results || []).map((g) => ({
    id: g.id,
    name: g.name,
    coverUrl: g.background_image,
    released: g.released,
  }));

  res.json(games);
});

export default router;
