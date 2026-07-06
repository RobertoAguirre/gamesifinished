import { Router } from 'express';
import { getAuth } from '@clerk/express';
import GameEntry from '../models/GameEntry.js';

const router = Router();

function requireAuth(req, res, next) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  next();
}

// Feed público: todas las victorias, para presumir.
router.get('/', async (req, res) => {
  const entries = await GameEntry.find().sort({ createdAt: -1 }).limit(60);
  res.json(entries);
});

router.get('/mine', requireAuth, async (req, res) => {
  const { userId } = getAuth(req);
  const entries = await GameEntry.find({ clerkUserId: userId }).sort({ createdAt: -1 });
  res.json(entries);
});

router.post('/', requireAuth, async (req, res) => {
  const { userId } = getAuth(req);
  const {
    username,
    gameName,
    gameRawgId,
    gameCoverUrl,
    finishedDate,
    hoursSpent,
    levelReached,
    evidenceUrl,
    evidenceType,
  } = req.body;

  if (!username || !gameName || !finishedDate || !evidenceUrl) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const entry = await GameEntry.create({
    clerkUserId: userId,
    username,
    gameName,
    gameRawgId,
    gameCoverUrl,
    finishedDate,
    hoursSpent,
    levelReached,
    evidenceUrl,
    evidenceType,
  });

  res.status(201).json(entry);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const { userId } = getAuth(req);
  const entry = await GameEntry.findById(req.params.id);
  if (!entry) return res.status(404).json({ error: 'No encontrado' });
  if (entry.clerkUserId !== userId) return res.status(403).json({ error: 'No autorizado' });

  await entry.deleteOne();
  res.status(204).end();
});

export default router;
