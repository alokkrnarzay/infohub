import fs from 'fs';
import path from 'path';

// Lightweight .env loader (no external deps). It will not overwrite existing env vars.
try {
  const envFile = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envFile)) {
    const raw = fs.readFileSync(envFile, 'utf8');
    raw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx === -1) return;
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    });
  }
} catch (e) {
  // ignore .env parse errors
}

const url = process.env.VITE_UPSTASH_REST_URL;
const token = process.env.VITE_UPSTASH_REST_TOKEN;

if (!url || !token) {
  console.error('VITE_UPSTASH_REST_URL or VITE_UPSTASH_REST_TOKEN is not set. See .env.example');
  process.exit(2);
}

async function check() {
  try {
    const trimmed = url.replace(/\/$/, '');
    // Try a GET on /get/<some-random-key> - Upstash responds with JSON even if key missing
    const testKey = '__infohub_health_check_key__';
    const res = await fetch(`${trimmed}/get/${encodeURIComponent(testKey)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('HTTP', res.status, res.statusText);
    const body = await res.text();
    console.log('Body:', body);
    if (res.ok) {
      console.log('Upstash connectivity: OK');
      process.exit(0);
    }
    console.error('Upstash connectivity: FAILED');
    process.exit(3);
  } catch (err) {
    console.error('Error checking Upstash:', err);
    process.exit(1);
  }
}

check();
