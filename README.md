# Tamás Pogrányi – Portfolio

[![Website](https://img.shields.io/badge/Live%20Site-www.pogranyitamas.com-blue?style=flat-square)](https://www.pogranyitamas.com)

## Overview

This is the personal portfolio of **Tamás Pogrányi**, a Full Stack Developer specializing in React, TypeScript, and .NET. The site showcases my work, skills, and experience, and provides a way to get in touch. I develop web, mobile, and desktop applications, and enjoy learning new technologies.

## Features
- About me and my background
- Work experience and major projects
- Tech stack and skills
- Project portfolio with live demos and source code
- Contact form
- Multilingual support (EN, HU, DE)
- Modern, responsive design

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion
- **State & i18n:** React Context, react-i18next
- **3D/Visuals:** Three.js, @react-three/fiber, @react-three/drei
- **Backend:** Vercel Functions (also self-hostable on Node — see below), Supabase
- **Infrastructure:** Docker, Caddy, GitHub Actions, GHCR
- **Other:** EmailJS, React Icons

## Getting Started

### Local Development

#### 1. Setup Environment Variables

Copy the app environment file and fill in your actual API keys:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- EmailJS service ID, template ID, and public key
- reCAPTCHA site and secret keys  
- Tuya API credentials for Vercel functions (device ID, client ID, secret, access token)

For the websocket worker, create a separate env file:
```bash
cp worker/.env.example worker/.env
```

#### 2. Install Dependencies & Run

This is a [pnpm](https://pnpm.io/) workspace (frontend + Vercel API in the root package,
websocket worker in `worker/`). npm and yarn are rejected by a `preinstall` guard.

If you don't have pnpm, Node 22+ ships Corepack:
```bash
corepack enable                # or: npm i -g pnpm
```

```bash
pnpm install             # Installs both the root package and the worker

# Option 1: Run frontend + API + websocket worker together
pnpm dev:all             # API (3001) + worker + Vite app (5173)

# Option 2: Run separately
pnpm dev:api             # Start the local API server on port 3001
pnpm worker:dev          # Start websocket worker (in separate terminal)
pnpm dev                 # Start Vite frontend on port 5173 (in separate terminal)
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

`pnpm dev:api` runs `server/index.ts`, a small Node HTTP host that mounts the same
`api/**` handlers Vercel deploys — no Vercel CLI, no linked project, works offline.
It is also exactly what runs inside the `api` container, so local and containerized
behaviour cannot drift apart.

### Deployment to Vercel (App only)

#### 1. Environment Variables in Vercel Dashboard

Go to your Vercel project → **Settings** → **Environment Variables** and add all variables from your `.env` file:

**Important:** Add these environment variables for all environments (Production, Preview, Development):
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_RECAPTCHA_SITE_KEY`
- `VITE_RECAPTCHA_SECRET_KEY`
- `VITE_TUYA_API_BASE_URL`
- `VITE_TUYA_DEVICE_ID`
- `TUYA_CLIENT_ID`
- `TUYA_SECRET`
- `EASY_ACCESS_TOKEN` (optional, for faster testing)

**Note:** You don't need to set `VITE_API_BASE_URL` or `VITE_TUYA_USE_PROXY` for Vercel deployments, as the serverless API functions at `/api/*` are automatically used.

#### 2. Deploy App

Push to GitHub and Vercel will automatically build and deploy:

```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

## Docker

All three parts are containerized, but they are not all deployed to the same place.

**Default split:**

- **Vercel** serves the frontend and the `api/**` functions (deployed by Vercel's own
  pipeline on push).
- **Raspberry Pi** runs only the `worker` container — the long-lived Tuya → Supabase
  subscriber, which has no place on serverless.

The `web` and `api` containers exist and are fully working, but they sit behind a
compose profile so the Pi does not run them by default. That keeps the option of
self-hosting everything one flag away, without it being the normal path.

```bash
docker compose up -d                  # worker only (the default, and what CI does)
docker compose --profile full up -d   # web + api + worker on the Pi as well
```

The `api/**` handlers are shared verbatim between both deploy targets, so running
the API on the Pi can never drift from what Vercel serves.

### Images

One multi-target `Dockerfile` produces three images:

| Target   | Base            | Contents |
|----------|-----------------|----------|
| `web`    | `caddy:2-alpine` | Built Vite SPA + `/api` reverse proxy + automatic TLS |
| `api`    | `node:22-alpine` | Self-contained bundle of `server/index.ts` + `api/**` |
| `worker` | `node:22-alpine` | Self-contained bundle of `worker/src/server-worker.ts` |

The `api` and `worker` images are esbuild bundles: **no `node_modules`, no pnpm,
no `tsx` at runtime**. That keeps them small on an SD card and removes the whole
shared-lockfile install dance that used to be needed on the Pi.

Build stages run with `--platform=$BUILDPLATFORM`, so the heavy work (pnpm install,
`tsc -b && vite build`, esbuild) happens natively on the amd64 CI runner and only
the thin runtime layer is built for `linux/arm64`. Under QEMU the Vite build of the
3D assets would take minutes.

### Running locally

Your existing root `.env` already has the Tuya/Supabase values, so this just works
(`.env.docker.example` documents the Docker-specific extras):

```bash
pnpm docker:up      # web + api from source; open http://localhost
pnpm docker:logs
pnpm docker:down
```

`docker:up` deliberately starts **web and api only**. Running the worker locally
would insert the same Tuya datapoints into Supabase a second time, alongside the one
already running on the Pi. Use `pnpm docker:up:all` when you actually want it.

Set `HTTP_PORT=8080` in `.env` if port 80 is taken.

### Deploying

Pushing to `master` builds the `worker` image and restarts it on the Pi. The Pi never
builds: CI pushes multi-arch images to GHCR, copies `docker-compose.yml` and a
generated `.env` to `/var/www/portfolio`, and runs `docker compose pull && up -d`.

To also host the frontend and API on the Pi, run the workflow manually:
**Actions → Deploy to Raspberry Pi → Run workflow**, with `full_stack` checked. That
builds all three images and writes `COMPOSE_PROFILES=full` into the Pi's `.env`, so
subsequent deploys keep the full stack running. Clearing that line reverts to
worker-only (stop the extra containers once with
`docker compose --profile full down` first — a worker-only deploy leaves already
running services alone rather than tearing them down behind your back).

When the full stack runs, `SITE_ADDRESS` is the single TLS switch:

- `SITE_ADDRESS=:80` — plain HTTP, for LAN or behind a tunnel that terminates TLS
- `SITE_ADDRESS=portfolio.example.com` — automatic Let's Encrypt certificate and
  HTTP→HTTPS redirect

Caddy's certificates live in the `caddy_data` volume; do not delete it or every
restart will request a fresh certificate and hit Let's Encrypt rate limits.

### One-time setup on the Raspberry Pi

The previous deployment ran the worker under pm2 and never needed Docker, so install
it once:

```bash
curl -fsSL https://get.docker.com | sh    # installs engine + compose plugin
sudo usermod -aG docker $USER
sudo systemctl enable --now docker
# log out and back in, then verify:
docker compose version
```

The deploy workflow runs a preflight check first, so if any of this is missing the
job stops with an explicit message instead of a bare `docker: command not found`.

The preflight also prints `uname -m`. It should say `aarch64` — the images are built
for `linux/arm64`. If it says `armv7l`, the Pi is running a 32-bit OS and
`platforms:` in the workflow needs `linux/arm/v7` added.

### One-time migration from the pm2 worker

The previous setup ran the worker under pm2 in `/var/www/portfolio-worker`. Both
would write the same rows to Supabase, so retire the old one **before** the first
container deploy:

```bash
pm2 delete tuya-worker && pm2 save
```

### Required GitHub secrets and variables

Needed for the default worker-only deploy: `RASPBERRY_PI_HOST`,
`RASPBERRY_PI_USERNAME`, `RASPBERRY_PI_SSH_KEY`, `SUPABASE_URL`,
`SUPABASE_SECRET_KEY`, `TUYA_CLIENT_ID`, `TUYA_SECRET`.

Only needed for a `full_stack` run: `VITE_TUYA_DEVICE_ID`,
`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`,
`VITE_RECAPTCHA_SITE_KEY`.

Repository variables (all optional, with defaults): `SITE_ADDRESS` (`:80`), `TZ`
(`Europe/Budapest`), `VITE_TUYA_API_BASE_URL` (`https://openapi.tuyaeu.com`),
`TUYA_MSG_REGION` (`EU`), `WORKER_STALE_AFTER_MS` (`0`).

The workflow logs the Pi into GHCR with the job's `GITHUB_TOKEN`, which is enough
for private packages. Making the packages public also lets you run
`docker compose pull` on the Pi by hand without logging in.

### Health endpoints

- `api` → `GET /healthz`
- `worker` → `GET :3002/healthz`, reporting WebSocket connection state, message and
  insert counters. It returns 503 while disconnected, so Docker restarts a worker
  that has exhausted its reconnect attempts. Message-staleness detection is opt-in
  via `WORKER_STALE_AFTER_MS` (off by default — reporting frequency is device
  dependent, and a badly chosen threshold would restart a perfectly healthy worker).

#### Architecture

**Development:**
- Frontend: `http://localhost:5173`
- API (`server/index.ts` hosting `api/**`): `http://localhost:3001/api/*`
- Websocket worker: separate Node process (`worker/src/server-worker.ts`)
- Vite proxy: `/api` -> `localhost:3001`

**Production (default):**
- Frontend + API: Vercel — `https://pogranyitamas.com`, `/api/*`
- Websocket worker: `worker` container on the Raspberry Pi

**Production (optional full self-hosting, `COMPOSE_PROFILES=full`):**
- `web` (Caddy) serves the SPA and proxies `/api/*` to `api:3001`
- `api` and `worker` are not exposed outside the compose network

## License & Credits

Some 3D models used in this project are licensed under CC-BY-4.0. See the `public/models` directory for details and attributions.

---

Visit the live site: [www.pogranyitamas.com](https://www.pogranyitamas.com)
