const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = !!url && !!anonKey;

if (!isSupabaseConfigured) {
  // Helpful during local dev: show why remote sync is disabled.
  // Vite will inline these env values at build time; avoid leaking secrets.
  // Check your .env.local or Vercel project env vars.
  // (No sensitive values are logged here, just presence/absence.)
  // eslint-disable-next-line no-console
  console.warn('[supabase] not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable remote sync');
}

let _supabase: any = null;
export async function getSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  if (_supabase) return _supabase;
  try {
    const mod = await import('@supabase/supabase-js');
    _supabase = mod.createClient(url!, anonKey!);
    return _supabase;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[supabase] dynamic import failed', e?.message || e);
    return null;
  }
}

/**
 * Get a value from the `kv` table where `key` is the primary key.
 * The table schema expected:
 * CREATE TABLE kv (key text primary key, value jsonb);
 */
export async function getKV(key: string): Promise<any | null> {
  const client = await getSupabaseClient();
  if (!client) {
    // eslint-disable-next-line no-console
    console.debug('[supabase] getKV skipped (not configured) for key', key);
    return null;
  }
  try {
    const { data, error } = await client.from('kv').select('value').eq('key', key).maybeSingle();
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
  const client = await getSupabaseClient();
  if (!client) {
    // eslint-disable-next-line no-console
    console.debug('[supabase] setKV skipped (not configured) for key', key);
    return false;
  }
  try {
    const payload = { key, value };
    // Use upsert so we create or update.
    const { error } = await client.from('kv').upsert(payload, { onConflict: 'key' });
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

/**
 * Delete a key from the `kv` table.
 * Returns true on success, false on failure or when supabase is not configured.
 */
export async function deleteKV(key: string): Promise<boolean> {
  const client = await getSupabaseClient();
  if (!client) {
    // eslint-disable-next-line no-console
    console.debug('[supabase] deleteKV skipped (not configured) for key', key);
    return false;
  }
  try {
    const { error } = await client.from('kv').delete().eq('key', key);
    if (error) {
      console.warn('supabase deleteKV error', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('supabase deleteKV exception', err);
    return false;
  }
}

export default null;
