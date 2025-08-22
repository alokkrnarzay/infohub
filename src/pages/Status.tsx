import { useEffect, useState } from 'react';
import { isUpstashConfigured, upstashGet } from '@/lib/upstash';

export default function StatusPage() {
  const [upstashStatus, setUpstashStatus] = useState<string>('unknown');
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!isUpstashConfigured) {
        if (mounted) setUpstashStatus('not configured');
        return;
      }
      try {
        const res = await upstashGet('__infohub_health_check_key__');
        if (!mounted) return;
        setUpstashStatus(res === null ? 'connected (key missing)' : 'connected');
      } catch (err) {
        if (!mounted) return;
        console.warn('Upstash check failed', err);
        setUpstashStatus('error');
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-4">Status</h1>
      <p className="mb-2">Application status and diagnostics.</p>
      <div className="mt-6 space-y-4">
        <div>
          <h3 className="font-semibold">Upstash KV</h3>
          <p className="text-sm text-gray-600">Configured: {isUpstashConfigured ? 'yes' : 'no'}</p>
          <p className="text-sm text-gray-600">Connection: {upstashStatus}</p>
        </div>
        <div>
          <h3 className="font-semibold">LocalStorage</h3>
          <p className="text-sm text-gray-600">Available in browser environment.</p>
        </div>
      </div>
    </div>
  );
}
