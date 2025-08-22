// Minimal health-check endpoint for diagnosing Serverless routing/runtime.
export default function handler(req, res) {
  try {
    const hasUpstash = !!(process.env.UPSTASH_REST_URL && process.env.UPSTASH_REST_TOKEN);
    const hasSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
    const adminKeySet = !!process.env.ADMIN_API_KEY;
    return res.status(200).json({ ok: true, hasUpstash, hasSupabase, adminKeySet, ts: Date.now() });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
