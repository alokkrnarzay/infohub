import { useState, useEffect, useRef } from 'react';
import { isSupabaseConfigured, getKV, setKV } from '@/lib/supabase';
import { isUpstashConfigured, upstashGet } from '@/lib/upstash';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // If a remote backend is configured, prefer remote as the source of truth
      if (isUpstashConfigured || isSupabaseConfigured) {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Try to fetch remote value once and use it. Preference order: Upstash (client-side) then Supabase.
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        let remote: any = null;
        if (isUpstashConfigured) {
          remote = await upstashGet(key);
        } else if (isSupabaseConfigured) {
          remote = await getKV(key);
        }
        if (!mounted) return;
        if (remote !== null && remote !== undefined) {
          // Use remote value as the source of truth. Do NOT write it into localStorage
          // when a remote backend is configured — the user requested remote-only persistence.
          setStoredValue(remote as T);
        }
      } catch (err) {
        console.warn('Failed to sync initial value from remote', err);
      }
    })();
    return () => { mounted = false; };
  }, [key]);

  // Poll remote KV for updates so multiple clients see changes shortly after an admin saves.
  // Only enabled when a remote backend is configured.
  useEffect(() => {
    if (!isUpstashConfigured && !isSupabaseConfigured) return;
    let mounted = true;
    const latestRef = useRef<any>(storedValue);
    // keep ref in sync when storedValue changes
    latestRef.current = storedValue;

    const interval = setInterval(async () => {
      try {
        let remote: any = null;
        if (isUpstashConfigured) {
          remote = await upstashGet(key);
        } else if (isSupabaseConfigured) {
          remote = await getKV(key);
        }
        if (!mounted) return;
        if (remote !== undefined && remote !== null) {
          const current = JSON.stringify(latestRef.current);
          const next = JSON.stringify(remote);
          if (current !== next) {
            setStoredValue(remote as T);
            try {
              window.dispatchEvent(new CustomEvent('local-storage', { detail: { key, newValue: remote } }));
            } catch (err) {
              // ignore
            }
          }
        }
      } catch (err) {
        // ignore intermittent errors
      }
    }, 3000); // poll every 3s for faster propagation

    return () => { mounted = false; clearInterval(interval); };
  }, [key]);

  // Keep hook in sync across tabs (storage event) and within the same tab
  // (custom 'local-storage' event dispatched after setItem).
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      try {
        const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
        setStoredValue(newValue);
      } catch (err) {
        console.error(`Error parsing storage event for key "${key}":`, err);
      }
    };

    const handleCustom = (e: Event) => {
      const ev = e as CustomEvent;
      if (!ev?.detail) return;
      if (ev.detail.key !== key) return;
      setStoredValue(ev.detail.newValue as T);
    };

    // Only listen to the browser 'storage' event when no remote backend exists. When
    // a remote backend is configured, cross-tab sync should come from the remote store.
    if (!isUpstashConfigured && !isSupabaseConfigured) {
      window.addEventListener('storage', handleStorage);
    }
    // Always listen to the in-app custom event to notify other components in the same tab.
    window.addEventListener('local-storage', handleCustom as EventListener);

    return () => {
      if (!isUpstashConfigured && !isSupabaseConfigured) {
        window.removeEventListener('storage', handleStorage);
      }
      window.removeEventListener('local-storage', handleCustom as EventListener);
    };
  }, [key, initialValue]);

  // Ensure initialValue is persisted once if the key is not present in localStorage
  // Only do this when no remote backend is configured.
  useEffect(() => {
    if (isUpstashConfigured || isSupabaseConfigured) return;
    try {
      const exists = window.localStorage.getItem(key);
      if (exists === null) {
        const stringified = JSON.stringify(storedValue);
        window.localStorage.setItem(key, stringified);
      }
    } catch (err) {
      // ignore write errors
      console.warn(`Could not persist initial localStorage key "${key}"`, err);
    }
    // We intentionally depend on key only; storedValue may change, but we only want
    // to write the initial value when the key is absent.
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      // Remote-first: if Upstash or Supabase configured, persist remotely and do NOT depend on localStorage.
      if (isUpstashConfigured) {
        // eslint-disable-next-line no-console
        console.debug('[useLocalStorage] scheduling remote upstashSet for key', key);
        try {
          // fire-and-forget; update UI immediately
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          (async () => {
            try { await (await import('@/lib/upstash')).upstashSet(key, valueToStore); } catch (e) { console.warn('Failed to write KV to Upstash', e); }
          })();
        } catch (err) {
          console.warn('Upstash set error', err);
        }
      } else if (isSupabaseConfigured) {
        // eslint-disable-next-line no-console
        console.debug('[useLocalStorage] scheduling remote setKV for key', key);
        try {
          setKV(key, valueToStore).catch((e) => console.warn('Failed to write KV to Supabase', e));
        } catch (err) {
          console.warn('Supabase setKV error', err);
        }
      } else {
        // fallback to localStorage when no remote configured
        try {
          const stringified = JSON.stringify(valueToStore);
          window.localStorage.setItem(key, stringified);
        } catch (err) {
          console.warn(`Could not write localStorage key "${key}"`, err);
        }
      }
      // Notify same-tab listeners (other components) about the change.
      try {
        window.dispatchEvent(
          new CustomEvent('local-storage', { detail: { key, newValue: valueToStore } })
        );
      } catch (err) {
        // Some older browsers may throw — ignore but keep localStorage updated.
        console.warn('Could not dispatch local-storage event', err);
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}