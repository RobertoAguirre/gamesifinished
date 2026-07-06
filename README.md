# GamesIFinished 🎮

Sitio para presumir los videojuegos que has terminado: fecha, tiempo invertido, nivel alcanzado y evidencia (captura o video).

Monorepo: `client` (Svelte + Vite) y `server` (Express + MongoDB), desplegados como **un solo servicio** en Render — el servidor Express sirve tanto la API (`/api/*`) como el build estático del cliente.

## Servicios externos que necesitas

1. **MongoDB** — crea una base gratis en [MongoDB Atlas](https://www.mongodb.com/atlas) y copia el connection string.
2. **Clerk** — crea una app en [clerk.com](https://clerk.com), habilita "Email" y "Google" como métodos de inicio de sesión, copia `Publishable key` y `Secret key`.
3. **RAWG** — pide una API key gratis en [rawg.io/apidocs](https://rawg.io/apidocs) para el buscador de juegos.
4. **Cloudinary** — crea una cuenta gratis en [cloudinary.com](https://cloudinary.com), copia tu `Cloud name` y crea un **Upload preset unsigned** (Settings → Upload → Upload presets) para subir evidencia directo desde el navegador.

## Desarrollo local

```bash
npm install
cp server/.env.example server/.env   # completa con tus llaves
cp client/.env.example client/.env   # completa con tus llaves
npm run dev
```

Esto levanta el cliente en `http://localhost:5173` (con proxy de `/api` hacia el server) y el server en `http://localhost:5000`.

## Build y arranque en producción

```bash
npm run build   # compila el cliente a client/dist
npm start       # levanta Express, sirve /api y el cliente compilado
```

## Deploy en Render

1. Sube el repo a GitHub.
2. En Render, crea un **Blueprint** apuntando a este repo (usa `render.yaml`) o un **Web Service** manual con:
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
3. Configura las variables de entorno (`MONGODB_URI`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `RAWG_API_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`) en el dashboard de Render.
4. Deploy. Un solo servicio, un solo puerto.
