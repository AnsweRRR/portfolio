/**
 * Thin adapter that makes the Vercel Function handlers (`api/**`) runnable on a
 * native Node HTTP server. This way the `api/` files don't change a single line:
 * the same code runs on Vercel and in the Docker container.
 *
 * It only implements as much of the Vercel surface as the handlers actually
 * use (query, body, cookies, status/json/send/redirect) — it's not meant to
 * replicate the full `@vercel/node` runtime.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export type VercelHandler = (
  req: VercelRequest,
  res: VercelResponse,
) => void | Promise<void>;

export type NodeHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  url: URL,
) => Promise<void>;

/** 1 MB — the current handlers don't even read the body; this is just a sane upper bound. */
const MAX_BODY_BYTES = 1024 * 1024;

export class HttpError extends Error {
  constructor(
    readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/**
 * Vercel's `req.query` returns an array for a repeated key, otherwise a string.
 * `api/tuya/status.ts`'s `req.query.refresh === 'true'` check relies on this, for example.
 */
function parseQuery(url: URL): Record<string, string | string[]> {
  const query: Record<string, string | string[]> = {};

  for (const key of new Set(url.searchParams.keys())) {
    const values = url.searchParams.getAll(key);
    query[key] = values.length > 1 ? values : values[0];
  }

  return query;
}

function parseCookies(header: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;

  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;

    const name = part.slice(0, eq).trim();
    if (!name) continue;

    try {
      cookies[name] = decodeURIComponent(part.slice(eq + 1).trim());
    } catch {
      // Malformed percent-encoding: the raw value is more useful than a 500 error.
      cookies[name] = part.slice(eq + 1).trim();
    }
  }

  return cookies;
}

async function readBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of req) {
    const buf = chunk as Buffer;
    size += buf.length;
    if (size > MAX_BODY_BYTES) {
      throw new HttpError(413, 'Request body too large');
    }
    chunks.push(buf);
  }

  return Buffer.concat(chunks);
}

function parseBody(raw: Buffer, contentType: string | undefined): unknown {
  if (raw.length === 0) return undefined;

  const type = (contentType ?? '').split(';')[0].trim().toLowerCase();

  if (type === 'application/json') {
    try {
      return JSON.parse(raw.toString('utf8'));
    } catch {
      throw new HttpError(400, 'Invalid JSON body');
    }
  }

  if (type === 'application/x-www-form-urlencoded') {
    return Object.fromEntries(new URLSearchParams(raw.toString('utf8')));
  }

  if (type.startsWith('text/')) {
    return raw.toString('utf8');
  }

  return raw;
}

function decorateResponse(res: ServerResponse): VercelResponse {
  const vres = res as unknown as VercelResponse;

  vres.status = (statusCode: number) => {
    res.statusCode = statusCode;
    return vres;
  };

  vres.json = (body: unknown) => {
    if (!res.hasHeader('content-type')) {
      res.setHeader('content-type', 'application/json; charset=utf-8');
    }
    res.end(JSON.stringify(body));
    return vres;
  };

  vres.send = (body: unknown) => {
    if (body === undefined || body === null) {
      res.end();
      return vres;
    }

    if (Buffer.isBuffer(body)) {
      res.end(body);
      return vres;
    }

    if (typeof body === 'string') {
      if (!res.hasHeader('content-type')) {
        res.setHeader('content-type', 'text/html; charset=utf-8');
      }
      res.end(body);
      return vres;
    }

    return vres.json(body);
  };

  vres.redirect = (statusOrUrl: string | number, url?: string) => {
    const statusCode = typeof statusOrUrl === 'number' ? statusOrUrl : 307;
    const location = typeof statusOrUrl === 'number' ? url : statusOrUrl;

    if (!location) {
      throw new Error('res.redirect() requires a location');
    }

    res.statusCode = statusCode;
    res.setHeader('location', location);
    res.end();
    return vres;
  };

  return vres;
}

/** Native Node HTTP handler from a Vercel handler. */
export function toNodeHandler(handler: VercelHandler): NodeHandler {
  return async (req, res, url) => {
    const vreq = req as unknown as VercelRequest;

    vreq.query = parseQuery(url);
    vreq.cookies = parseCookies(req.headers.cookie);

    if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
      vreq.body = parseBody(await readBody(req), req.headers['content-type']);
    }

    await handler(vreq, decorateResponse(res));
  };
}
