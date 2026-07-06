import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { clerkMiddleware } from '@clerk/express';
import { connectDB } from './db.js';
import gamesRouter from './routes/games.js';
import entriesRouter from './routes/entries.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.join(__dirname, '../../client/dist');

const app = express();

app.use(express.json());
app.use(clerkMiddleware());

app.use('/api/games', gamesRouter);
app.use('/api/entries', entriesRouter);

app.use(express.static(clientDist));

// SPA fallback: cualquier GET que no sea /api sirve el index del cliente.
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(clientDist, 'index.html'));
  }
  next();
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server escuchando en puerto ${PORT}`));
  })
  .catch((err) => {
    console.error('Error conectando a MongoDB', err);
    process.exit(1);
  });
