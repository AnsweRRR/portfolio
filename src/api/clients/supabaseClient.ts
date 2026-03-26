import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

export function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error(
      'Hiányzó Supabase beállítás: állítsd be a SUPABASE_URL és SUPABASE_SECRET_KEY változókat a .env fájlban (lásd .env.example).',
    );
  }
  return createClient(url, key);
}
