// Server-side KV read endpoint. Query param: ?key=site_contact
// Prefers Upstash server-side when UPSTASH_REST_URL and UPSTASH_REST_TOKEN are set.
const UPSTASH_URL = process.env.UPSTASH_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REST_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) return null;
  try {
    const mod = await import('@supabase/supabase-js');
    return mod.createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[api/kv] failed to dynamically import supabase', e?.message || e);
    return null;
  }
}

export default async function handler(req: any, res: any) {
  try {
    const key = req.method === 'GET' ? req.query.key : req.body?.key;
    if (!key) return res.status(400).json({ error: 'Missing key' });

    if (UPSTASH_URL && UPSTASH_TOKEN) {
      const ures = await fetch(UPSTASH_URL.replace(/\/$/, '') + `/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      if (!ures.ok) {
        const body = await ures.text();
        return res.status(500).json({ error: body });
      }
      const data = await ures.json();
      return res.status(200).json({ result: data.result ?? null });
    }

    const supabase = await getSupabaseClient();
    if (!supabase) return res.status(500).json({ error: 'No upstream configured' });
    const { data, error } = await supabase.from('kv').select('value').eq('key', key).single();
    if (error) return res.status(500).json({ error });
    return res.status(200).json({ result: data?.value ?? null });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[api/kv] handler error', err?.stack || err?.message || err);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
