import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const BASE_URL = process.env.VITE_TUYA_API_BASE_URL as string;
const DEVICE_ID = process.env.VITE_TUYA_DEVICE_ID as string;
const CLIENT_ID = process.env.VITE_TUYA_CLIENT_ID as string;
const SECRET = process.env.VITE_TUYA_SECRET as string;
const EASY_ACCESS_TOKEN = process.env.EASY_ACCESS_TOKEN as string | undefined;

if (!BASE_URL || !DEVICE_ID || !CLIENT_ID || !SECRET) {
  console.warn('Missing Tuya configuration in environment');
}

let cachedToken: string | null = EASY_ACCESS_TOKEN ?? null;
let tokenExpiry = 0;

interface CachedStatus {
  data: unknown;
  timestamp: number;
}
let cachedStatus: CachedStatus | null = null;
const STATUS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function sha256Hex(data: string): string {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

async function hmacSha256(key: string, data: string): Promise<string> {
  return crypto
    .createHmac('sha256', key)
    .update(data)
    .digest('hex')
    .toUpperCase();
}

interface TokenResponse {
  result: {
    access_token: string;
    expire_time: number;
    refresh_token: string;
  };
  success: boolean;
}

async function fetchToken(): Promise<string> {
  const t = Date.now().toString();
  const nonce = '';
  const method = 'GET';
  const path = '/v1.0/token?grant_type=1';
  const bodyStr = '';
  const bodySha256 = sha256Hex(bodyStr);
  
  const signStr = `${method}\n${bodySha256}\n\n${path}`;
  const str = CLIENT_ID + '' + t + nonce + signStr;
  const sign = await hmacSha256(SECRET, str);

  const url = `${BASE_URL}${path}`;
  
  const res = await fetch(url, {
    headers: {
      client_id: CLIENT_ID,
      sign,
      t,
      sign_method: 'HMAC-SHA256',
    },
  });
  
  const json = (await res.json()) as TokenResponse;
  
  if (!res.ok) throw new Error(`Token request failed: ${res.status}`);
  if (!json.success) {
    throw new Error(`Token endpoint returned failure: ${JSON.stringify(json)}`);
  }
  cachedToken = json.result.access_token;
  tokenExpiry = Date.now() + json.result.expire_time * 1000;
  console.log('[Token] Successfully obtained token, expires in', json.result.expire_time, 'seconds');
  return cachedToken;
}

async function ensureToken(): Promise<string> {
  if (EASY_ACCESS_TOKEN) {
    cachedToken = EASY_ACCESS_TOKEN;
    return EASY_ACCESS_TOKEN;
  }
  if (!cachedToken || Date.now() > tokenExpiry) {
    return fetchToken();
  }
  return cachedToken;
}

/** Postman-szerinti aláírás:
 * signStr = method + bodySha256 + headersStr + url, sign = HMAC(clientId+accessToken+timestamp+nonce+signStr, secret)
**/
function calcSign(
  clientId: string,
  accessToken: string,
  timestamp: string,
  nonce: string,
  signStr: string,
  secret: string
): Promise<string> {
  const str = clientId + accessToken + timestamp + nonce + signStr;
  return hmacSha256(secret, str);
}

async function buildStatusRequestHeaders(): Promise<Record<string, string>> {
  const token = await ensureToken();
  const t = Date.now().toString();
  const nonce = '';
  const method = 'GET';
  const path = `/v1.0/devices/${DEVICE_ID}/status`;
  const bodyStr = '';
  const bodySha256 = sha256Hex(bodyStr);
  const signStr = `${method}\n${bodySha256}\n\n${path}`;
  const sign = await calcSign(CLIENT_ID!, token, t, nonce, signStr, SECRET!);

  return {
    client_id: CLIENT_ID!,
    access_token: token,
    sign,
    t,
    sign_method: 'HMAC-SHA256',
  };
}

app.use(cors());

app.get('/api/tuya/status', async (req: express.Request, res: express.Response) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    
    const now = Date.now();
    if (!forceRefresh && cachedStatus && (now - cachedStatus.timestamp) < STATUS_CACHE_TTL) {
      console.log('[Server] Returning cached status (age:', Math.round((now - cachedStatus.timestamp) / 1000), 'seconds)');
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Cache-Age', Math.round((now - cachedStatus.timestamp) / 1000).toString());
      return res.json(cachedStatus.data);
    }

    console.log('[Server]', forceRefresh ? 'Force refresh requested' : 'Cache miss', '- fetching from Tuya API');
    const url = `${BASE_URL}/v1.0/devices/${DEVICE_ID}/status`;
    const headers = await buildStatusRequestHeaders();
    const tuyaRes = await fetch(url, { headers });
    const data = await tuyaRes.json();
    
    cachedStatus = {
      data,
      timestamp: now,
    };
    console.log('[Server] Cached new status data (TTL:', STATUS_CACHE_TTL / 1000, 'seconds)');
    
    res.setHeader('X-Cache', forceRefresh ? 'REFRESH' : 'MISS');
    res.setHeader('X-Cache-Age', '0');
    res.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Server] Error:', err);
    res.status(500).json({ error: msg });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
