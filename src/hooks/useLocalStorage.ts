import { useState, useEffect } from 'react';
import { isSupabaseConfigured, getKV, setKV } from '@/lib/supabase';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // If Supabase is configured, try to fetch the remote value once and use it
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let mounted = true;
    (async () => {
      try {
        const remote = await getKV(key);
        if (!mounted) return;
        if (remote !== null && remote !== undefined) {
          setStoredValue(remote as T);
          try {
            window.localStorage.setItem(key, JSON.stringify(remote));
          } catch (e) {
            // ignore
          }
        }
      } catch (err) {
        console.warn('Failed to sync initial value from Supabase', err);
      }
    })();
    return () => { mounted = false; };
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

    window.addEventListener('storage', handleStorage);
    window.addEventListener('local-storage', handleCustom as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('local-storage', handleCustom as EventListener);
    };
  }, [key, initialValue]);

  // Ensure initialValue is persisted once if the key is not present in localStorage.
  useEffect(() => {
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
      const stringified = JSON.stringify(valueToStore);
      window.localStorage.setItem(key, stringified);
      // If Supabase is configured, persist remotely as well.
      if (isSupabaseConfigured) {
        // eslint-disable-next-line no-console
        console.debug('[useLocalStorage] scheduling remote setKV for key', key);
        try {
          setKV(key, valueToStore).catch((e) => console.warn('Failed to write KV to Supabase', e));
        } catch (err) {
          console.warn('Supabase setKV error', err);
        }
      } else {
        // eslint-disable-next-line no-console
        console.debug('[useLocalStorage] remote sync disabled; running only localStorage for key', key);
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