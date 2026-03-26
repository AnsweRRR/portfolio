import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error(
      'Missing Supabase config: set SUPABASE_URL and SUPABASE_SECRET_KEY environment variables.',
    );
  }
  return createClient(url, key);
}

const WEATHER_HISTORY_MS = 24 * 60 * 60 * 1000;

function datapointTimeToMs(t: number): number {
  // A DB-ben lehet Unix másodperc vagy milliszekundum is; próbáljuk automatikusan normalizálni.
  return t > 100_000_000_000 ? t : t * 1000;
}

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  console.log('[weather/history] invoked', {
    method: req.method,
    hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
    hasSupabaseKey: Boolean(process.env.SUPABASE_SECRET_KEY),
  });

  // CORS headers (a tuya endpoint mintájára).
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    let supabase: ReturnType<typeof getSupabaseClient>;
    try {
      supabase = getSupabaseClient();
    } catch {
      res.status(200).json({ temperature: [], humidity: [] });
      return;
    }

    const since = Date.now() - WEATHER_HISTORY_MS;

    const [tempRes, humRes] = await Promise.all([
      supabase
        .from('temp_current')
        .select('time,value')
        .order('time', { ascending: false })
        .limit(3000),
      supabase
        .from('humidity_value')
        .select('time,value')
        .order('time', { ascending: false })
        .limit(3000),
    ]);

    if ('error' in tempRes && tempRes.error) {
      console.error('[weather/history] temp_current:', tempRes.error);
    }
    if ('error' in humRes && humRes.error) {
      console.error('[weather/history] humidity_value:', humRes.error);
    }

    const temperature = (tempRes.data ?? [])
      .filter((r) => datapointTimeToMs(r.time) >= since)
      .map((r) => ({ time: r.time, value: r.value }))
      .sort((a, b) => datapointTimeToMs(a.time) - datapointTimeToMs(b.time));

    const humidity = (humRes.data ?? [])
      .filter((r) => datapointTimeToMs(r.time) >= since)
      .map((r) => ({ time: r.time, value: r.value }))
      .sort((a, b) => datapointTimeToMs(a.time) - datapointTimeToMs(b.time));

    res.status(200).json({ temperature, humidity });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[weather/history] Error:', err);
    res.status(500).json({ error: msg });
  }
};

