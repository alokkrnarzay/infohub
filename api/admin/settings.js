export default async function handler(req, res) {
  const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
  const UPSTASH_URL = process.env.UPSTASH_REST_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_REST_TOKEN;

  const adminKey = req.headers['x-admin-key'] || req.headers['authorization'];
  if (!ADMIN_API_KEY || adminKey !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { key, value } = req.body || {};
  if (!key) return res.status(400).json({ error: 'Missing key' });

  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return res.status(500).json({ error: 'Upstash not configured on server' });
    }

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
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
