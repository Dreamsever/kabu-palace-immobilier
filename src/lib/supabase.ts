import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Resolve environment variables across Vite client, Vite SSR, and Nitro/Node environments
const rawUrl =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env['VITE_SUPABASE_URL'] || import.meta.env['NEXT_PUBLIC_SUPABASE_URL'])) ||
  (typeof process !== 'undefined' && process.env && (process.env['VITE_SUPABASE_URL'] || process.env['NEXT_PUBLIC_SUPABASE_URL'])) ||
  'https://vfxugfqcmqspghdbxqhq.supabase.co';

const rawKey =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env['VITE_SUPABASE_ANON_KEY'] || import.meta.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'])) ||
  (typeof process !== 'undefined' && process.env && (process.env['VITE_SUPABASE_ANON_KEY'] || process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'])) ||
  'sb_publishable_p1WvMWtTCRr4G0U9TUV3pQ_66cs3eYo';

function normalizeUrl(url: unknown): string | null {
  if (!url || typeof url !== 'string' || !url.trim()) return null;
  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}.supabase.co`;
  }
  if (trimmed.startsWith('https://') && !trimmed.includes('.')) {
    return `${trimmed}.supabase.co`;
  }
  return trimmed;
}

const supabaseUrl = normalizeUrl(rawUrl);
const supabaseAnonKey = typeof rawKey === 'string' && rawKey.trim() ? rawKey.trim() : null;

let client: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: typeof window !== 'undefined',
        autoRefreshToken: typeof window !== 'undefined',
      },
    });
  } catch (err) {
    console.warn('[Supabase] Initialization failed, will fallback to static data:', err);
    client = null;
  }
}

export const supabase = client;
