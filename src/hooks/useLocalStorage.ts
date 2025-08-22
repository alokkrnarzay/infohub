import { useState, useEffect } from 'react';

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

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      const stringified = JSON.stringify(valueToStore);
      window.localStorage.setItem(key, stringified);
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