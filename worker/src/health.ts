/**
 * Minimal health endpoint for the worker.
 *
 * The worker opens neither an HTTP server nor a port, so a container can end up in a
 * "running, but actually dead" state (the Tuya WS reconnect attempts ran out, but the
 * process is still alive). This server provides the compose healthcheck signal that lets
 * Docker restart the stuck container.
 */
import http from 'node:http';

const PORT = Number(process.env.WORKER_HEALTH_PORT ?? 3002);
const HOST = process.env.WORKER_HEALTH_HOST ?? '0.0.0.0';

/**
 * If > 0, the health endpoint returns 503 once this many ms have passed without a
 * Tuya message. OFF by default: message frequency is device-dependent, and a
 * badly chosen threshold would restart a perfectly healthy worker.
 * The WebSocket connection state (`connected`) is the reliable liveness signal.
 */
const STALE_AFTER_MS = Number(process.env.WORKER_STALE_AFTER_MS ?? 0);

interface HealthState {
  connected: boolean;
  startedAt: number;
  lastConnectedAt: number | null;
  lastMessageAt: number | null;
  messageCount: number;
  insertCount: number;
  errorCount: number;
  lastError: string | null;
}

const state: HealthState = {
  connected: false,
  startedAt: Date.now(),
  lastConnectedAt: null,
  lastMessageAt: null,
  messageCount: 0,
  insertCount: 0,
  errorCount: 0,
  lastError: null,
};

export function markConnected(): void {
  state.connected = true;
  state.lastConnectedAt = Date.now();
}

export function markDisconnected(): void {
  state.connected = false;
}

export function markMessage(): void {
  state.lastMessageAt = Date.now();
  state.messageCount += 1;
}

export function markInsert(): void {
  state.insertCount += 1;
}

export function markError(error: unknown): void {
  state.errorCount += 1;
  state.lastError = error instanceof Error ? error.message : String(error);
}

function isStale(): boolean {
  if (STALE_AFTER_MS <= 0) return false;

  // Until a first message arrives, we measure against the worker's start time.
  const reference = state.lastMessageAt ?? state.startedAt;
  return Date.now() - reference > STALE_AFTER_MS;
}

export function startHealthServer(): http.Server {
  const server = http.createServer((req, res) => {
    const healthy = state.connected && !isStale();

    res.statusCode = healthy ? 200 : 503;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.setHeader('cache-control', 'no-store');

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    res.end(
      JSON.stringify({
        ok: healthy,
        connected: state.connected,
        stale: isStale(),
        uptimeSeconds: Math.round(process.uptime()),
        lastConnectedAt: state.lastConnectedAt,
        lastMessageAt: state.lastMessageAt,
        messageCount: state.messageCount,
        insertCount: state.insertCount,
        errorCount: state.errorCount,
        lastError: state.lastError,
      }),
    );
  });

  server.listen(PORT, HOST, () => {
    console.log(`[health] listening on http://${HOST}:${PORT}`);
  });

  return server;
}
