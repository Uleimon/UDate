import { useCallback, useEffect, useState } from 'react';
import { API_URL } from './config';

export type ServerState = 'not_configured' | 'checking' | 'online' | 'offline';

/** Fragt /health/ready am echten Server ab. Kein Server eingetragen = "not_configured". */
export async function checkServer(timeoutMs = 6000): Promise<ServerState> {
  if (!API_URL) return 'not_configured';
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(`${API_URL}/health/ready`, { signal: ctrl.signal });
    return r.ok ? 'online' : 'offline';
  } catch {
    return 'offline';
  } finally {
    clearTimeout(t);
  }
}

export function useServerStatus() {
  const [state, setState] = useState<ServerState>(API_URL ? 'checking' : 'not_configured');
  const refresh = useCallback(() => {
    if (!API_URL) return;
    setState('checking');
    void checkServer().then(setState);
  }, []);
  useEffect(refresh, [refresh]);
  return { state, refresh };
}
