import { useQuery } from '@tanstack/react-query';

const BASE_URL = import.meta.env.VITE_TUYA_API_BASE_URL as string;
const DEVICE_ID = import.meta.env.VITE_TUYA_DEVICE_ID as string;
const CLIENT_ID = import.meta.env.VITE_TUYA_CLIENT_ID as string;
const SECRET = import.meta.env.VITE_TUYA_SECRET as string;

if (!BASE_URL || !DEVICE_ID || !CLIENT_ID || !SECRET) {
  console.warn(
    'smartHomeClient: missing environment variable (BASE_URL, DEVICE_ID, CLIENT_ID or SECRET)',
  );
}

interface ApiResult {
  code: string;
  value: string | number | boolean;
}

interface ApiResponse {
  result: ApiResult[];
  success: boolean;
  t: number;
  tid: string;
}

type DeviceStatus = ApiResponse;

async function hmacSha256(key: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const keyBuf = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', keyBuf, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

let cachedToken: string | null = null;
let tokenExpiry = 0;

interface TokenApiResponse {
  result: {
    access_token: string;
    expire_time: number; // seconds
    refresh_token: string;
  };
  success: boolean;
  t: number;
  tid: string;
}

async function fetchToken(): Promise<string> {
  const t = Date.now().toString();
  const signString = CLIENT_ID + t;
  const sign = await hmacSha256(SECRET, signString);

  const url = `${BASE_URL}/v1.0/token?grant_type=1`;
  const res = await fetch(url, {
    headers: {
      client_id: CLIENT_ID,
      sign,
      t,
      sign_method: 'HMAC-SHA256',
    },
  });
  if (!res.ok) {
    throw new Error(`Token request failed: ${res.status}`);
  }
  const json = (await res.json()) as TokenApiResponse;
  if (!json.success) {
    throw new Error('Token response indicates failure');
  }
  cachedToken = json.result.access_token;
  tokenExpiry = Date.now() + json.result.expire_time * 1000;
  return cachedToken;
}

async function ensureToken(): Promise<string> {
  if (!cachedToken || Date.now() > tokenExpiry) {
    return fetchToken();
  }
  return cachedToken;
}

async function buildHeaders(includeToken = true): Promise<Record<string, string>> {
  const t = Date.now().toString();
  let token: string | undefined;
  if (includeToken) token = await ensureToken();
  const signString = CLIENT_ID + (token || '') + t;
  const sign = await hmacSha256(SECRET, signString);
  const headers: Record<string, string> = {
    client_id: CLIENT_ID,
    sign,
    t,
    sign_method: 'HMAC-SHA256',
  };
  if (token) headers.access_token = token;
  return headers;
}

async function fetchDeviceStatus(): Promise<DeviceStatus> {
  if (import.meta.env.VITE_TUYA_USE_PROXY === 'true') {
    const res = await fetch('/api/tuya/status');
    if (!res.ok) {
      throw new Error(`Proxy fetch failed: ${res.status}`);
    }
    return res.json();
  }

  const url = `${BASE_URL}/v1.0/devices/${DEVICE_ID}/status`;
  const headers = await buildHeaders();
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch device status: ${res.status}`);
  }
  return res.json();
}

import type { UseQueryOptions } from '@tanstack/react-query';

export function useDeviceStatus(
  options?: UseQueryOptions<DeviceStatus, Error>,
) {
  return useQuery<DeviceStatus, Error>({
    queryKey: ['deviceStatus', DEVICE_ID],
    queryFn: fetchDeviceStatus,
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export { fetchDeviceStatus };