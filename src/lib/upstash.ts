export const upstashUrl = import.meta.env.VITE_UPSTASH_REST_URL as string | undefined;
export const upstashToken = import.meta.env.VITE_UPSTASH_REST_TOKEN as string | undefined;

export const isUpstashConfigured = !!upstashUrl && !!upstashToken;

async function request(path: string, opts: RequestInit = {}) {
  if (!isUpstashConfigured) return null;
  const url = upstashUrl!.replace(/\/$/, '') + path;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${upstashToken}`,
    ...(opts.headers as Record<string, string> || {}),
  };
  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) {
    try {
      const body = await res.text();
      console.warn('[upstash] request failed', res.status, body);
    } catch (_) {}
    return null;
  }
  try {
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function upstashGet(key: string): Promise<any | null> {
  const data = await request(`/get/${encodeURIComponent(key)}`);
  if (!data) return null;
  return data.result ?? null;
}

export async function upstashSet(key: string, value: any): Promise<boolean> {
  const res = await request(`/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    body: JSON.stringify({ value }),
  });
  return res !== null;
}

export async function upstashDelete(key: string): Promise<boolean> {
  const res = await request(`/del/${encodeURIComponent(key)}`, { method: 'POST' });
  return res !== null;
}

export default { isUpstashConfigured, upstashGet, upstashSet, upstashDelete };
