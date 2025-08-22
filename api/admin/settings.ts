import { createClient } from '@supabase/supabase-js';

// This endpoint requires the ADMIN_API_KEY header to match the server's ADMIN_API_KEY
// It prefers Upstash if configured (UPSTASH_REST_URL and UPSTASH_REST_TOKEN),
// otherwise it falls back to Supabase service role.

const UPSTASH_URL = process.env.UPSTASH_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REST_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

if (!UPSTASH_URL && (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE)) {
  // eslint-disable-next-line no-console
  console.warn('[api/admin/settings] missing upstream config (Upstash or Supabase service role)');
}

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
  : null;

export default async function handler(req: any, res: any) {
  const adminKey = req.headers['x-admin-key'] || req.headers['authorization'];
  if (!ADMIN_API_KEY || adminKey !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured on server' });
  }

  try {
    if (req.method === 'POST') {
      const { key, value } = req.body || {};
      if (!key) return res.status(400).json({ error: 'Missing key' });
      // Prefer Upstash when configured
      if (UPSTASH_URL && UPSTASH_TOKEN) {
        const ures = await fetch(UPSTASH_URL.replace(/\/$/, '') + `/set/${encodeURIComponent(key)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${UPSTASH_TOKEN}` },
          body: JSON.stringify({ value }),
        });
        if (!ures.ok) {
          const body = await ures.text();
          return res.status(500).json({ error: body });
        }
        return res.status(200).json({ ok: true });
      }

      if (!supabase) return res.status(500).json({ error: 'No upstream configured' });
      const payload = { key, value };
      const { error } = await supabase.from('kv').upsert(payload, { onConflict: 'key' });
      if (error) return res.status(500).json({ error });
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const { key } = req.body || {};
      if (!key) return res.status(400).json({ error: 'Missing key' });
      if (UPSTASH_URL && UPSTASH_TOKEN) {
        const ures = await fetch(UPSTASH_URL.replace(/\/$/, '') + `/del/${encodeURIComponent(key)}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
        });
        if (!ures.ok) {
          const body = await ures.text();
          return res.status(500).json({ error: body });
        }
        return res.status(200).json({ ok: true });
      }
      if (!supabase) return res.status(500).json({ error: 'No upstream configured' });
      const { error } = await supabase.from('kv').delete().eq('key', key);
      if (error) return res.status(500).json({ error });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[api/admin/settings] handler error', err);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
