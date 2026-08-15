/**
 * Minimális health endpoint a workerhez.
 *
 * A worker se HTTP szervert, se portot nem nyit, így konténerben előállhat a
 * "fut, de valójában halott" állapot (a Tuya WS reconnect elfogyott, a process
 * viszont él). Ez a szerver adja a compose healthcheck jelét, amire a Docker
 * újra tudja indítani a beragadt konténert.
 */
import http from 'node:http';

const PORT = Number(process.env.WORKER_HEALTH_PORT ?? 3002);
const HOST = process.env.WORKER_HEALTH_HOST ?? '0.0.0.0';

/**
 * Ha > 0, a health endpoint 503-at ad, amikor ennyi ideje nem érkezett Tuya
 * üzenet. Alapból KI van kapcsolva: az üzenetek gyakorisága eszközfüggő, és egy
 * rosszul belőtt küszöb egy tökéletesen egészséges workert indítana újra.
 * A WebSocket kapcsolat állapota (`connected`) a megbízható liveness-jel.
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

  // Amíg egyetlen üzenet sem jött, a worker indulási idejéhez mérünk.
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
