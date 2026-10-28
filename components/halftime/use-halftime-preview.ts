'use client';

import { useEffect, useState } from 'react';
import { getBrowserSupabaseClient } from '@/lib/supabase/browser';
import type { HalftimeReport } from '@/lib/data/halftime/report';

type PreviewState = {
  status: 'loading' | 'ready' | 'signed-out' | 'forbidden' | 'error';
  report: HalftimeReport | null;
};

export function useHalftimePreview(enabled: boolean, loadReport = false) {
  const [state, setState] = useState<PreviewState>({
    status: 'loading',
    report: null,
  });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const client = getBrowserSupabaseClient();
    let alive = true,
      version = 0,
      authEvent = false;
    let controller: AbortController | null = null;
    const load = (token: string | null) => {
      const current = ++version;
      controller?.abort();
      controller = new AbortController();
      const signal = controller.signal;
      setState({ status: token ? 'loading' : 'signed-out', report: null });
      if (!token) return;
      void fetch(`/api/halftime-preview${loadReport ? '' : '?access=1'}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
        signal,
      })
        .then(async (response) => {
          const result = response.ok
            ? ((await response.json()) as {
                allowed?: boolean;
                report?: HalftimeReport;
              })
            : null;
          if (!alive || current !== version) return;
          setState({
            status:
              response.status === 401
                ? 'signed-out'
                : response.status === 403
                  ? 'forbidden'
                  : result?.allowed && (!loadReport || result.report)
                    ? 'ready'
                    : 'error',
            report: result?.allowed ? (result.report ?? null) : null,
          });
        })
        .catch(() => {
          if (alive && current === version && !signal.aborted)
            setState({ status: 'error', report: null });
        });
    };
    if (!client) {
      void Promise.resolve().then(() => {
        if (alive) load(null);
      });
      return () => {
        alive = false;
      };
    }
    void client.auth
      .getSession()
      .then(({ data, error }) => {
        if (!alive || authEvent) return;
        if (error) setState({ status: 'error', report: null });
        else load(data.session?.access_token ?? null);
      })
      .catch(() => {
        if (alive && !authEvent) setState({ status: 'error', report: null });
      });
    const { data: listener } = client.auth.onAuthStateChange(
      (_event, session) => {
        authEvent = true;
        if (alive) load(session?.access_token ?? null);
      },
    );
    return () => {
      alive = false;
      version++;
      controller?.abort();
      listener.subscription.unsubscribe();
    };
  }, [enabled, loadReport, attempt]);
  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
