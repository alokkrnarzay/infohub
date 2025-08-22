import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const UPSTASH_URL = process.env.UPSTASH_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REST_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

if (!UPSTASH_URL && (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE)) {
  // eslint-disable-next-line no-console
  console.warn('[dev-admin-api] missing SUPABASE or UPSTASH credentials in .env');
}

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
  : null;

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.post('/admin/settings', async (req, res) => {
  const adminKey = req.headers['x-admin-key'] || req.headers['authorization'];
  if (!ADMIN_API_KEY || adminKey !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { key, value } = req.body || {};
  if (!key) return res.status(400).json({ error: 'Missing key' });
  try {
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
      return res.json({ ok: true });
    }
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
    const { error } = await supabase.from('kv').upsert({ key, value }, { onConflict: 'key' });
    if (error) return res.status(500).json({ error });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected' });
  }
});

app.delete('/admin/settings', async (req, res) => {
  const adminKey = req.headers['x-admin-key'] || req.headers['authorization'];
  if (!ADMIN_API_KEY || adminKey !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { key } = req.body || {};
  if (!key) return res.status(400).json({ error: 'Missing key' });
  try {
    if (UPSTASH_URL && UPSTASH_TOKEN) {
      const ures = await fetch(UPSTASH_URL.replace(/\/$/, '') + `/del/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      if (!ures.ok) {
        const body = await ures.text();
        return res.status(500).json({ error: body });
      }
      return res.json({ ok: true });
    }
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
    const { error } = await supabase.from('kv').delete().eq('key', key);
    if (error) return res.status(500).json({ error });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected' });
  }
});

const port = process.env.DEV_API_PORT || 8787;
app.listen(port, () => console.log(`[dev-admin-api] listening on http://localhost:${port}`));
