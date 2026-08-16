# syntax=docker/dockerfile:1.7
#
# Payload CMS (blog backend), packaged separately from the root Dockerfile's
# web/api/worker targets. Payload's Admin UI ships as a Next.js app, and the
# `sharp` dependency (image processing for uploads) needs native arm64 binaries,
# so this build does NOT use the root Dockerfile's --platform=$BUILDPLATFORM
# cross-compile shortcut — it builds natively for whatever platform is requested.
# Expect this image to build noticeably slower than web/api/worker under QEMU.
#
# Runtime base is node:*-slim (glibc), not alpine (musl): sharp/libvips is the
# more battle-tested combination and this avoids a class of native-binary
# runtime crash that's hard to debug on a headless Pi.

ARG NODE_VERSION=22

FROM node:${NODE_VERSION} AS deps
ENV CI=1 \
    PNPM_HOME=/pnpm \
    npm_config_store_dir=/pnpm/store
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY cms/package.json cms/

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store,sharing=locked \
    pnpm install --frozen-lockfile --filter portfolio-cms...


FROM deps AS build
COPY cms cms
WORKDIR /app/cms
RUN pnpm run build

# Next's file tracer (@vercel/nft) only copies @swc/helpers' cjs/ folder into
# the standalone output's shared pnpm store entry — but Next's own runtime
# require-hook also loads from esm/ at that exact same path, so the container
# crashes on boot with "Cannot find module .../@swc/helpers/esm/...".
# outputFileTracingIncludes in next.config.mjs does not reliably fix this
# (confirmed by direct inspection of the traced output), so the missing half
# of the package is copied in directly from the untraced install here instead.
WORKDIR /app
RUN set -e; \
    src="$(find node_modules/.pnpm -maxdepth 1 -iname '@swc+helpers@*' | head -1)/node_modules/@swc/helpers/esm"; \
    dst="$(find cms/.next/standalone/node_modules/.pnpm -maxdepth 1 -iname '@swc+helpers@*' | head -1)/node_modules/@swc/helpers/esm"; \
    test -d "$src"; \
    cp -rL "$src" "$dst"


FROM node:${NODE_VERSION}-slim AS cms
ENV NODE_ENV=production \
    PORT=3002 \
    NODE_OPTIONS=--enable-source-maps \
    HOSTNAME=0.0.0.0

WORKDIR /app
COPY --from=build /app/cms/.next/standalone ./
COPY --from=build /app/cms/.next/static ./cms/.next/static
COPY --from=build /app/cms/public ./cms/public

USER node
EXPOSE 3002

# A longer start-period than web/api/worker: Payload's DB connection handshake
# and admin bundle registration make this the slowest service to boot.
# node:*-slim has no wget/curl (unlike the alpine images the other services use),
# so the check goes through Node's own http client instead.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD node -e "require('node:http').get('http://127.0.0.1:3002/api/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "cms/server.js"]
