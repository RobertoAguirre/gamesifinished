# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

GamesIFinished: a site to show off finished video games (date, hours spent, level reached, and evidence — screenshot or video). Monorepo with `client` (Svelte 5 + Vite) and `server` (Express + MongoDB), deployed as **one single service** on Render — Express serves both the API (`/api/*`) and the compiled client build.

## Commands

```bash
npm install                          # installs both workspaces
cp server/.env.example server/.env   # then fill in real keys
cp client/.env.example client/.env   # then fill in real keys
npm run dev                          # runs client (5173, proxies /api) + server (5000) concurrently
npm run build                        # builds client into client/dist
npm start                            # runs Express only, serving /api + client/dist (production mode)
```

There is no test suite, linter, or type checker configured in either workspace.

Run a single workspace directly with `--workspace`, e.g. `npm run dev --workspace=server`.

## External services required

The app hard-fails without these env vars set (server exits on missing `MONGODB_URI`; client throws on missing Clerk key):

1. **MongoDB Atlas** — `MONGODB_URI`
2. **Clerk** (auth, Email + Google) — `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY` (server), `VITE_CLERK_PUBLISHABLE_KEY` (client)
3. **RAWG** (game search API) — `RAWG_API_KEY`
4. **Cloudinary** (evidence upload, unsigned upload preset) — `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`

## Architecture

**Single deployable service.** `server/src/index.js` mounts the API routers under `/api`, then serves `client/dist` as static files, then falls back to `index.html` for any other GET (SPA routing). In dev, Vite's dev server proxies `/api` to the Express server on 5000 (`client/vite.config.js`); in prod there's only one process/port.

**Auth is Clerk end-to-end, no custom session/JWT handling.** The client holds a `Clerk` instance (`client/src/lib/clerk.js`) and a Svelte store (`client/src/lib/stores/auth.js`) wrapping it. `client/src/lib/api.js` attaches the Clerk session token as a Bearer header on every request. The server uses `clerkMiddleware()` globally (`server/src/index.js`) and each route pulls identity via `getAuth(req)`; routes that need auth wrap with a local `requireAuth` (see `server/src/routes/entries.js`) — there's no shared auth middleware file, it's redefined per router.

**Data model is a single collection.** `GameEntry` (`server/src/models/GameEntry.js`) is the only Mongoose model — one document per "I finished this game" post, denormalized (stores `username`, `gameName`, `gameCoverUrl` directly rather than referencing separate User/Game collections). `clerkUserId` is the ownership key, checked on delete.

**Two data sources feed entries:** RAWG (`server/src/routes/games.js`, proxied so the API key stays server-side) for game metadata/search when creating an entry, and Cloudinary (`client/src/lib/cloudinary.js`, called directly from the browser via the unsigned upload preset — no server involvement) for evidence file hosting.

**Client is view-toggle based, not routed.** `App.svelte` holds a single `view` state (`feed` / `add` / `mine`) switched by `Navbar`; there's no router/URL-based navigation.
