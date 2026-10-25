import { useCallback, useEffect, useState } from 'react';
import { api } from './api';

// Loads `url` on mount / when it changes; `reload()` refetches without clearing data.
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));

  const load = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    try {
      setData(await api.get(url));
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => { setData(null); }, [url]);
  useEffect(() => { load(); }, [load]);
  return { data, error, loading, reload: load };
}

export function useDebounced(value, ms = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}
