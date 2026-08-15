# syntax=docker/dockerfile:1.7
#
# Multi-target Dockerfile a portfolio stackhez. Három image épül belőle:
#
#   --target web     caddy + a lefordított Vite SPA + /api reverse proxy + auto-TLS
#   --target api     node + az api/** Vercel handlerek self-contained bundle-je
#   --target worker  node + a Tuya WSS -> Supabase worker bundle-je
#
# A build stage-ek `--platform=$BUILDPLATFORM`-mal futnak, tehát a nehéz munka
# (pnpm install, tsc + vite build, esbuild) natívan megy az amd64 runneren, és
# csak a vékony runtime réteg épül linux/arm64-re a Raspberry Pi-hez. A `dist/`
# és a .cjs bundle architektúra-független, így ez teljesen biztonságos — QEMU
# alatt viszont a 3D assetes Vite build percekig tartana.

ARG NODE_VERSION=22-alpine
ARG CADDY_VERSION=2-alpine


# ---------------------------------------------------------------------------
# base: közös Node + pnpm réteg (build oldal, mindig a builder architektúráján)
# ---------------------------------------------------------------------------
FROM --platform=$BUILDPLATFORM node:${NODE_VERSION} AS base

ENV CI=1 \
    PNPM_HOME=/pnpm \
    npm_config_store_dir=/pnpm/store
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
WORKDIR /app


# ---------------------------------------------------------------------------
# deps: függőségek telepítése. Csak a manifestek másolódnak, hogy a forráskód
# változása ne érvénytelenítse az install réteget.
# ---------------------------------------------------------------------------
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY worker/package.json worker/

# A pnpm store cache mountja gyorsítja az ismételt buildeket; a npm cache azért
# kell, mert a root package.json `preinstall`-ja `npx only-allow pnpm`-et futtat.
# A pnpm-workspace.yaml `onlyBuiltDependencies` mezője adja az esbuild
# postinstall engedélyét — e nélkül a vite build és a bundlerek elhasalnának.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store,sharing=locked \
    --mount=type=cache,id=npm-cache,target=/root/.npm,sharing=locked \
    pnpm install --frozen-lockfile


# ---------------------------------------------------------------------------
# web-build: a Vite SPA lefordítása
# ---------------------------------------------------------------------------
FROM deps AS web-build

# A Vite build-időben inline-olja a VITE_* változókat, ezért ezek build-argok.
# Kizárólag publikus, kliensbe szánt kulcsok kerülhetnek ide.
#
# A VITE_API_BASE_URL szándékosan üres: a Caddy ugyanarról az originről proxyzza
# az /api-t, a smartHomeClient.ts apiOrigin()-je pedig üres érték mellett
# same-origin hívást csinál.
ARG VITE_EMAILJS_SERVICE_ID=""
ARG VITE_EMAILJS_TEMPLATE_ID=""
ARG VITE_EMAILJS_PUBLIC_KEY=""
ARG VITE_RECAPTCHA_SITE_KEY=""
ARG VITE_SHOW_SKILL_PROGRESS=""
ARG VITE_TUYA_USE_PROXY="true"

ENV VITE_EMAILJS_SERVICE_ID=$VITE_EMAILJS_SERVICE_ID \
    VITE_EMAILJS_TEMPLATE_ID=$VITE_EMAILJS_TEMPLATE_ID \
    VITE_EMAILJS_PUBLIC_KEY=$VITE_EMAILJS_PUBLIC_KEY \
    VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY \
    VITE_SHOW_SKILL_PROGRESS=$VITE_SHOW_SKILL_PROGRESS \
    VITE_TUYA_USE_PROXY=$VITE_TUYA_USE_PROXY

COPY . .
RUN pnpm run build


# ---------------------------------------------------------------------------
# api-build / worker-build: self-contained .cjs bundle-ök
# ---------------------------------------------------------------------------
FROM deps AS api-build

COPY scripts scripts
COPY api api
COPY server server
RUN node scripts/build-bundles.mjs --only=api


FROM deps AS worker-build

COPY scripts scripts
COPY worker worker
RUN node scripts/build-bundles.mjs --only=worker


# ---------------------------------------------------------------------------
# web: statikus kiszolgálás + TLS + /api proxy egyetlen konténerben
# ---------------------------------------------------------------------------
FROM caddy:${CADDY_VERSION} AS web

COPY docker/Caddyfile /etc/caddy/Caddyfile
COPY --from=web-build /app/dist /srv

EXPOSE 80 443

# A :8080-as belső health site-ot használjuk, nem a fő site-ot: domain esetén az
# utóbbi HTTP->HTTPS átirányítást adna, ami hamis "unhealthy"-t okozna.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null 2>&1 || exit 1


# ---------------------------------------------------------------------------
# api: az api/** handlerek Node HTTP hoston
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS api

ENV NODE_ENV=production \
    PORT=3001 \
    NODE_OPTIONS=--enable-source-maps

WORKDIR /app
COPY --from=api-build /app/out/api.cjs /app/out/api.cjs.map ./

USER node
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3001/healthz >/dev/null 2>&1 || exit 1

CMD ["node", "api.cjs"]


# ---------------------------------------------------------------------------
# worker: Tuya WebSocket -> Supabase
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS worker

ENV NODE_ENV=production \
    WORKER_HEALTH_PORT=3002 \
    NODE_OPTIONS=--enable-source-maps

WORKDIR /app
COPY --from=worker-build /app/out/worker.cjs /app/out/worker.cjs.map ./

USER node
EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3002/healthz >/dev/null 2>&1 || exit 1

CMD ["node", "worker.cjs"]
