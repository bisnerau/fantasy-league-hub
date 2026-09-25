'use client';

import { useEffect, useState } from 'react';
import { getBrowserSupabaseClient } from '@/lib/supabase/browser';

const lookups = new Map<string, Promise<number | null>>();

function rosterFor(userId: string) {
  const client = getBrowserSupabaseClient();
  if (!client) return Promise.resolve(null);
  let lookup = lookups.get(userId);
  if (!lookup) {
    lookup = Promise.resolve(
      client.from('profiles').select('roster_id').eq('id', userId).single(),
    )
      .then(({ data, error }) =>
        error ? null : ((data?.roster_id as number | null) ?? null),
      )
      .catch(() => null);
    lookups.set(userId, lookup);
  }
  return lookup;
}

/** The signed-in member's roster, or null when signed out or unknown. */
export function useMemberRoster() {
  const [rosterId, setRosterId] = useState<number | null>(null);

  useEffect(() => {
    const client = getBrowserSupabaseClient();
    if (!client) return;
    let alive = true;
    let version = 0;
    let authEvent = false;
    const load = (userId: string | null) => {
      const current = ++version;
      void (userId ? rosterFor(userId) : Promise.resolve(null)).then(
        (value) => {
          if (alive && current === version) setRosterId(value);
        },
      );
    };
    void client.auth
      .getSession()
      .then(({ data }) => {
        if (!authEvent) load(data.session?.user.id ?? null);
      })
      .catch(() => {
        if (!authEvent) load(null);
      });
    const { data: listener } = client.auth.onAuthStateChange(
      (_event, session) => {
        authEvent = true;
        void Promise.resolve().then(() => load(session?.user.id ?? null));
      },
    );
    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return rosterId;
}
