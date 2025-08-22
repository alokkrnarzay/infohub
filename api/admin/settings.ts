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

async function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) return null;
  try {
    const mod = await import('@supabase/supabase-js');
    return mod.createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[api/admin/settings] failed to dynamically import supabase', e?.message || e);
    return null;
  }
}

export default async function handler(req: any, res: any) {
  const adminKey = (req.headers['x-admin-key'] || req.headers['authorization'] || '').toString();
  if (!ADMIN_API_KEY || adminKey !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (req.method === 'POST') {
      const { key, value } = req.body || {};
      if (!key) return res.status(400).json({ error: 'Missing key' });

      // Prefer Upstash when configured
      if (UPSTASH_URL && UPSTASH_TOKEN) {
        // write key
        const setUrl = UPSTASH_URL.replace(/\/$/, '') + `/set/${encodeURIComponent(key)}`;
        const ures = await fetch(setUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${UPSTASH_TOKEN}` },
          body: JSON.stringify({ value }),
        });
        if (!ures.ok) {
          const body = await ures.text();
          // eslint-disable-next-line no-console
          console.error('[api/admin/settings] upstash set failed', body);
          return res.status(500).json({ error: body });
        }

        // publish lightweight notification (best-effort)
        try {
          const chan = 'infohub-updates';
          const pubUrl = UPSTASH_URL.replace(/\/$/, '') + `/publish/${encodeURIComponent(chan)}`;
          await fetch(pubUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${UPSTASH_TOKEN}` },
            body: JSON.stringify({ message: JSON.stringify({ key, value }) }),
          }).catch((e) => { /* ignore publish errors but log */
            // eslint-disable-next-line no-console
            console.warn('[api/admin/settings] upstash publish failed', e?.message || e);
          });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('[api/admin/settings] publish attempt error', e?.message || e);
        }

        // Best-effort: write a last-update marker so clients can short-poll it and apply updates quickly.
        try {
          const marker = { key, value, ts: Date.now() };
          const markerUrl = UPSTASH_URL.replace(/\/$/, '') + `/set/${encodeURIComponent('infohub:last_update')}`;
          const mres = await fetch(markerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${UPSTASH_TOKEN}` },
            body: JSON.stringify({ value: marker }),
          });
          if (!mres.ok) {
            const body = await mres.text();
            // eslint-disable-next-line no-console
            console.warn('[api/admin/settings] failed to write last_update marker', body);
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('[api/admin/settings] error writing last_update marker', e?.message || e);
        }

        // success
        return res.status(200).json({ ok: true });
      }

      // fallback to Supabase
      const supabase = await getSupabaseClient();
      if (!supabase) return res.status(500).json({ error: 'No upstream configured' });
      const payload = { key, value };
      const { error } = await supabase.from('kv').upsert(payload, { onConflict: 'key' });
      if (error) {
        // eslint-disable-next-line no-console
        console.error('[api/admin/settings] supabase upsert error', error);
        return res.status(500).json({ error });
      }
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
          // eslint-disable-next-line no-console
          console.error('[api/admin/settings] upstash del failed', body);
          return res.status(500).json({ error: body });
        }
        return res.status(200).json({ ok: true });
      }
      const supabase = await getSupabaseClient();
      if (!supabase) return res.status(500).json({ error: 'No upstream configured' });
      const { error } = await supabase.from('kv').delete().eq('key', key);
      if (error) {
        // eslint-disable-next-line no-console
        console.error('[api/admin/settings] supabase delete error', error);
        return res.status(500).json({ error });
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[api/admin/settings] handler error', err?.stack || err?.message || err);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
