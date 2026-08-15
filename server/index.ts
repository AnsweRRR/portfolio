/**
 * Node HTTP host az `api/**` Vercel Function handlerekhez.
 *
 * Ugyanaz a szerver fut lokálisan (`pnpm dev:api`) és a Docker `api` konténerben,
 * így a `vercel dev` (Vercel CLI + linkelt projekt + hálózat) függés megszűnik,
 * miközben a Vercel deploy változatlanul az `api/` fájlokat használja.
 */
import http from 'node:http';
import { HttpError, toNodeHandler, type NodeHandler } from './vercel-adapter';

const PORT = Number(process.env.PORT ?? 3001);
const HOST = process.env.HOST ?? '0.0.0.0';
const SHUTDOWN_TIMEOUT_MS = 10_000;

/**
 * A `.env`-et azelőtt kell betölteni, hogy az api handlerek modulszinten
 * kiolvassák a `process.env`-et (pl. `api/tuya/status.ts` a BASE_URL-t).
 * Ezért a handlerek dinamikus importtal jönnek be — statikus import esetén a
 * modul-kiértékelés sorrendje ezt csendben megtörné.
 */
function loadEnvFile(): void {
  if (process.env.NODE_ENV === 'production') return;

  try {
    process.loadEnvFile();
  } catch {
    // Nincs .env fájl — az env-változók kívülről jönnek.
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

  // Graceful shutdown: e nélkül a `docker compose down` 10 másodperc után
  // SIGKILL-lel lövi ki a konténert.
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
