import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  // eslint-disable-next-line no-console
  console.warn('[dev-admin-api] missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
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
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  const { key, value } = req.body || {};
  if (!key) return res.status(400).json({ error: 'Missing key' });
  try {
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
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  const { key } = req.body || {};
  if (!key) return res.status(400).json({ error: 'Missing key' });
  try {
    const { error } = await supabase.from('kv').delete().eq('key', key);
    if (error) return res.status(500).json({ error });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected' });
  }
});

const port = process.env.DEV_API_PORT || 8787;
app.listen(port, () => console.log(`[dev-admin-api] listening on http://localhost:${port}`));
