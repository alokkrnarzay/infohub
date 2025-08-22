export default async function handler(req, res) {
  const UPSTASH_URL = process.env.UPSTASH_REST_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_REST_TOKEN;

  const { key } = req.query || {};
  if (!key) return res.status(400).json({ error: 'Missing key' });

  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) return res.status(500).json({ error: 'Upstash not configured' });
    const ures = await fetch(UPSTASH_URL.replace(/\/$/, '') + `/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    if (!ures.ok) {
      if (ures.status === 404) return res.json({ result: null });
      const body = await ures.text();
      return res.status(500).json({ error: body });
    }
    const body = await ures.json();
    return res.json(body);
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
