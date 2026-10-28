'use client';

import { useEffect, useMemo, useState } from 'react';
import { getBrowserSupabaseClient } from '@/lib/supabase/browser';
import {
  isCompleteForecast,
  calculateSeasonConsensus,
} from '@/lib/predictions/season-consensus';

import {
  halftimeForecastInsights,
  type ForecastProfile,
} from '@/lib/season/halftime-forecasts';

type Ballot = { voter_id: string; rankings: number[] };
type State = {
  status: 'loading' | 'signed-out' | 'ready' | 'error';
  ballots: Ballot[];
  userId: string | null;
  profiles: ForecastProfile[];
};

// Use the signed-in browser session and existing RLS, never a server secret.
export function useHalftimeBallots(
  leagueId: string,
  teams: { id: number; name: string; rank: number; ai: number }[],
) {
  const rosterIds = teams.map((t) => t.id);
  const client = useMemo(() => getBrowserSupabaseClient(), []);
  const [state, setState] = useState<State>({
    status: 'loading',
    ballots: [],
    profiles: [],
    userId: null,
  });
  useEffect(() => {
    let alive = true,
      version = 0,
      authEvent = false;
    async function load(userId: string | null) {
      const request = ++version;
      if (!alive) return;
      setState({
        status: userId ? 'loading' : 'signed-out',
        ballots: [],
        profiles: [],
        userId,
      });
      if (!client || !userId) return;
      try {
        const [result, profiles] = await Promise.all([
          client
            .from('season_forecasts')
            .select('voter_id,rankings')
            .eq('league_id', leagueId)
            .eq('season', 2026),
          client.from('profiles').select('id,display_name,roster_id'),
        ]);
        if (result.error || profiles.error)
          throw Error('Manager receipts unavailable');
        if (alive && request === version)
          setState({
            status: 'ready',
            ballots: result.data ?? [],
            profiles: profiles.data ?? [],
            userId,
          });
      } catch {
        if (alive && request === version)
          setState({ status: 'error', ballots: [], profiles: [], userId });
      }
    }
    if (!client) {
      void Promise.resolve().then(() => load(null));
      return () => {
        alive = false;
      };
    }
    void client.auth
      .getSession()
      .then(({ data, error }) => {
        if (!alive || authEvent) return;
        if (error)
          setState({
            status: 'error',
            ballots: [],
            profiles: [],
            userId: null,
          });
        else void load(data.session?.user.id ?? null);
      })
      .catch(() => {
        if (alive && !authEvent)
          setState({
            status: 'error',
            ballots: [],
            profiles: [],
            userId: null,
          });
      });
    const { data: subscription } = client.auth.onAuthStateChange(
      (_event, session) => {
        authEvent = true;
        void load(session?.user.id ?? null);
      },
    );
    return () => {
      alive = false;
      version++;
      subscription.subscription.unsubscribe();
    };
  }, [client, leagueId]);
  const valid = [
    ...new Map(
      state.ballots
        .filter((b) => isCompleteForecast(b.rankings, rosterIds))
        .map((b) => [b.voter_id, b]),
    ).values(),
  ];
  return {
    status: state.status,
    insights: halftimeForecastInsights(valid, state.profiles, teams),
    count: valid.length,
    consensus: calculateSeasonConsensus(valid, rosterIds).map(
      (r) => r.rosterId,
    ),
    own: valid.find((b) => b.voter_id === state.userId)?.rankings ?? [],
  };
}
