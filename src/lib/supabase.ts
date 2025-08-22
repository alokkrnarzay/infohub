import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = !!url && !!anonKey;

export const supabase = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : null;

/**
 * Get a value from the `kv` table where `key` is the primary key.
 * The table schema expected:
 * CREATE TABLE kv (key text primary key, value jsonb);
 */
export async function getKV(key: string): Promise<any | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('kv').select('value').eq('key', key).maybeSingle();
    if (error) {
      console.warn('supabase getKV error', error);
      return null;
    }
    return data?.value ?? null;
  } catch (err) {
    console.warn('supabase getKV exception', err);
    return null;
  }
}

export async function setKV(key: string, value: any): Promise<boolean> {
  if (!supabase) return false;
  try {
    const payload = { key, value };
    // Use upsert so we create or update.
    const { error } = await supabase.from('kv').upsert(payload, { onConflict: 'key' });
    if (error) {
      console.warn('supabase setKV error', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('supabase setKV exception', err);
    return false;
  }
}

export default supabase;
