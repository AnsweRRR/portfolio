/**
 * Node HTTP host for the `api/**` Vercel Function handlers.
 *
 * The same server runs locally (`pnpm dev:api`) and in the Docker `api` container,
 * so the `vercel dev` dependency (Vercel CLI + linked project + network) goes away,
 * while the Vercel deploy still uses the `api/` files unchanged.
 */
import http from 'node:http';
import { HttpError, toNodeHandler, type NodeHandler } from './vercel-adapter';

const PORT = Number(process.env.PORT ?? 3001);
const HOST = process.env.HOST ?? '0.0.0.0';
const SHUTDOWN_TIMEOUT_MS = 10_000;

/**
 * `.env` must be loaded before the api handlers read `process.env` at module
 * scope (e.g. `api/tuya/status.ts` reading BASE_URL).
 * That's why the handlers are brought in via dynamic import — with a static import,
 * module-evaluation order would silently break this.
 */
function loadEnvFile(): void {
  if (process.env.NODE_ENV === 'production') return;

  try {
    process.loadEnvFile();
  } catch {
    // No .env file — the env vars come from outside.
  }
}

function healthz(): NodeHandler {
  return async (_req, res) => {
    res.statusCode = 200;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.end(JSON.stringify({ ok: true, uptime: Math.round(process.uptime()) }));
  };
}

async function buildRoutes(): Promise<Map<string, NodeHandler>> {
  const [tuyaStatus, weatherHistory] = await Promise.all([
    import('../api/tuya/status'),
    import('../api/weather/history'),
  ]);

  return new Map<string, NodeHandler>([
    ['/api/tuya/status', toNodeHandler(tuyaStatus.default)],
    ['/api/weather/history', toNodeHandler(weatherHistory.default)],
    ['/healthz', healthz()],
  ]);
}

function normalizePath(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;
}

function sendError(res: http.ServerResponse, statusCode: number, message: string): void {
  if (res.headersSent) {
    res.end();
    return;
  }

  res.statusCode = statusCode;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({ error: message }));
}

async function main(): Promise<void> {
  loadEnvFile();

  const routes = await buildRoutes();

  const server = http.createServer((req, res) => {
    const started = Date.now();
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    const path = normalizePath(url.pathname);

    res.on('finish', () => {
      console.log(`${req.method} ${path} ${res.statusCode} ${Date.now() - started}ms`);
    });

    const handler = routes.get(path);
    if (!handler) {
      sendError(res, 404, `Not found: ${path}`);
      return;
    }

    handler(req, res, url).catch((err: unknown) => {
      if (err instanceof HttpError) {
        sendError(res, err.statusCode, err.message);
        return;
      }

      console.error(`[server] Unhandled error on ${path}:`, err);
      sendError(res, 500, err instanceof Error ? err.message : String(err));
    });
  });

  server.listen(PORT, HOST, () => {
    console.log(`[server] listening on http://${HOST}:${PORT}`);
    for (const route of routes.keys()) {
      console.log(`[server]   ${route}`);
    }
  });

  // Graceful shutdown: without this, `docker compose down` kills the container
  // with SIGKILL after 10 seconds.
  const shutdown = (signal: string) => {
    console.log(`[server] ${signal} received, shutting down`);
    const timer = setTimeout(() => process.exit(1), SHUTDOWN_TIMEOUT_MS);
    timer.unref();

    server.close((err) => {
      if (err) {
        console.error('[server] Error during shutdown:', err);
        process.exit(1);
      }
      process.exit(0);
    });
    server.closeIdleConnections();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err: unknown) => {
  console.error('[server] Failed to start:', err);
  process.exit(1);
});
