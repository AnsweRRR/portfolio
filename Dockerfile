# syntax=docker/dockerfile:1.7
#
# Multi-target Dockerfile for the portfolio stack. Three images are built from it:
#
#   --target web     caddy + the compiled Vite SPA + /api reverse proxy + auto-TLS
#   --target api     node + a self-contained bundle of the api/** Vercel handlers
#   --target worker  node + the Tuya WSS -> Supabase worker bundle
#
# The build stages run with `--platform=$BUILDPLATFORM`, so the heavy work
# (pnpm install, tsc + vite build, esbuild) runs natively on the amd64 runner, and
# only the thin runtime layer is built for linux/arm64 for the Raspberry Pi. The `dist/`
# and the .cjs bundle are architecture-independent, so this is completely safe — whereas
# under QEMU the Vite build of the 3D assets would take minutes.

ARG NODE_VERSION=22-alpine
ARG CADDY_VERSION=2-alpine


# ---------------------------------------------------------------------------
# base: shared Node + pnpm layer (build side, always on the builder's architecture)
# ---------------------------------------------------------------------------
FROM --platform=$BUILDPLATFORM node:${NODE_VERSION} AS base

ENV CI=1 \
    PNPM_HOME=/pnpm \
    npm_config_store_dir=/pnpm/store
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
WORKDIR /app


# ---------------------------------------------------------------------------
# deps: install dependencies. Only the manifests are copied so that source code
# changes don't invalidate the install layer.
# ---------------------------------------------------------------------------
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY worker/package.json worker/

# The pnpm store cache mount speeds up repeated builds; the npm cache is needed
# because the root package.json's `preinstall` runs `npx only-allow pnpm`.
# The pnpm-workspace.yaml `onlyBuiltDependencies` field grants esbuild's
# postinstall permission — without it the vite build and the bundlers would fail.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store,sharing=locked \
    --mount=type=cache,id=npm-cache,target=/root/.npm,sharing=locked \
    pnpm install --frozen-lockfile


# ---------------------------------------------------------------------------
# web-build: compiling the Vite SPA
# ---------------------------------------------------------------------------
FROM deps AS web-build

# Vite inlines the VITE_* variables at build time, so these are build args.
# Only public, client-facing keys may go here.
#
# VITE_API_BASE_URL is deliberately empty: Caddy proxies /api from the same
# origin, and smartHomeClient.ts's apiOrigin() makes a same-origin call when
# the value is empty.
ARG VITE_EMAILJS_SERVICE_ID=""
ARG VITE_EMAILJS_TEMPLATE_ID=""
ARG VITE_EMAILJS_PUBLIC_KEY=""
ARG VITE_RECAPTCHA_SITE_KEY=""
ARG VITE_SHOW_SKILL_PROGRESS=""
ARG VITE_SHOW_BLOG=""
ARG VITE_TUYA_USE_PROXY="true"

ENV VITE_EMAILJS_SERVICE_ID=$VITE_EMAILJS_SERVICE_ID \
    VITE_EMAILJS_TEMPLATE_ID=$VITE_EMAILJS_TEMPLATE_ID \
    VITE_EMAILJS_PUBLIC_KEY=$VITE_EMAILJS_PUBLIC_KEY \
    VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY \
    VITE_SHOW_SKILL_PROGRESS=$VITE_SHOW_SKILL_PROGRESS \
    VITE_SHOW_BLOG=$VITE_SHOW_BLOG \
    VITE_TUYA_USE_PROXY=$VITE_TUYA_USE_PROXY

COPY . .
RUN pnpm run build


# ---------------------------------------------------------------------------
# api-build / worker-build: self-contained .cjs bundles
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
# web: static serving + TLS + /api proxy in a single container
# ---------------------------------------------------------------------------
FROM caddy:${CADDY_VERSION} AS web

COPY docker/Caddyfile /etc/caddy/Caddyfile
COPY --from=web-build /app/dist /srv

EXPOSE 80 443

# We use the internal :8080 health site, not the main site: with a domain, the
# latter would issue an HTTP->HTTPS redirect, which would cause a false "unhealthy".
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null 2>&1 || exit 1


# ---------------------------------------------------------------------------
# api: the api/** handlers on a Node HTTP host
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
