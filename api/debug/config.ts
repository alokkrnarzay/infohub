// Lightweight config debug endpoint. Returns which upstreams are configured (no secrets).
export default function handler(_req: any, res: any) {
  const hasUpstash = !!(process.env.UPSTASH_REST_URL && process.env.UPSTASH_REST_TOKEN);
  const hasSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  const adminKeySet = !!process.env.ADMIN_API_KEY;
  return res.status(200).json({ hasUpstash, hasSupabase, adminKeySet });
}