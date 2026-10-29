'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getBrowserSupabaseClient } from '@/lib/supabase/browser';
import {
  isCompleteHalftimeBallot,
  type HalftimeBallot,
} from '@/lib/season/halftime-ballot';

type Row = {
  voter_id: string;
  rankings: number[];
  championship: number[];
  loser_bowl: number[];
};
export type RevealedBallot = HalftimeBallot & {
  voter_id: string;
  name: string;
  rosterId: number | null;
  preseason: number[] | null;
};
type State = {
  status: 'loading' | 'signed-out' | 'ready' | 'error';
  userId: string | null;
  rows: Row[];
  filed: number | null;
  profiles: { id: string; display_name: string; roster_id: number | null }[];
  preseason: { voter_id: string; rankings: number[] }[];
};
const empty = (status: State['status'], userId: string | null): State => ({
  status,
  userId,
  rows: [],
  filed: null,
  profiles: [],
  preseason: [],
});
const fromRow = (row: Row): HalftimeBallot => ({
  rankings: row.rankings,
  championship: row.championship,
  loserBowl: row.loser_bowl,
});

// Starts unlocked and reads the clock after mount, so server and browser
// HTML always agree; long waits re-check instead of overflowing the timer.
function useLocked(lockAt: string) {
  const lockTime = Date.parse(lockAt);
  const [locked, setLocked] = useState(false);
  useEffect(() => {
    let timer = 0;
    const check = () => {
      const remaining = lockTime - Date.now();
      if (remaining <= 0) setLocked(true);
      else timer = window.setTimeout(check, Math.min(remaining, 2 ** 31 - 1));
    };
    timer = window.setTimeout(check, 0);
    return () => window.clearTimeout(timer);
  }, [lockTime]);
  return locked;
}

// Browser session and RLS only: before the lock a member reads their own
// ballot and the participation count; afterwards every ballot is revealed.
export function useSecondHalfBallot(
  leagueId: string,
  season: number,
  lockAt: string,
  rosterIds: number[],
) {
  const client = useMemo(() => getBrowserSupabaseClient(), []);
  const locked = useLocked(lockAt);
  const [state, setState] = useState<State>(() => empty('loading', null));
  const version = useRef(0);

  const load = useCallback(
    async (userId: string | null) => {
      const request = ++version.current;
      setState(empty(userId ? 'loading' : 'signed-out', userId));
      if (!client || !userId) return;
      try {
        const [rows, status, profiles, preseason] = await Promise.all([
          client
            .from('halftime_forecasts')
            .select('voter_id,rankings,championship,loser_bowl')
            .eq('league_id', leagueId)
            .eq('season', season),
          client.rpc('halftime_forecast_submission_status', {
            requested_league: leagueId,
            requested_season: season,
          }),
          client.from('profiles').select('id,display_name,roster_id'),
          client
            .from('season_forecasts')
            .select('voter_id,rankings')
            .eq('league_id', leagueId)
            .eq('season', season),
        ]);
        if (rows.error || profiles.error) throw Error('Ballots unavailable');
        if (request !== version.current) return;
        setState({
          status: 'ready',
          userId,
          rows: (rows.data as Row[] | null) ?? [],
          filed: status.error
            ? null
            : ((status.data as { submitted: boolean }[] | null) ?? []).filter(
                (r) => r.submitted,
              ).length,
          profiles: profiles.data ?? [],
          // Preseason ballots only power "change of heart"; a failure there
          // never blocks the second-half ballot.
          preseason: preseason.error ? [] : (preseason.data ?? []),
        });
      } catch {
        if (request === version.current) setState(empty('error', userId));
      }
    },
    [client, leagueId, season],
  );

  useEffect(() => {
    const requests = version;
    let alive = true;
    let authEvent = false;
    // Token refreshes and focus re-checks repeat the same user; reloading
    // for those would wipe a ballot that is half built.
    let current: string | null | undefined;
    const sync = (userId: string | null) => {
      if (userId === current) return;
      current = userId;
      void load(userId);
    };
    if (!client) {
      void Promise.resolve().then(() => {
        if (alive) sync(null);
      });
      return () => {
        alive = false;
      };
    }
    void client.auth
      .getSession()
      .then(({ data, error }) => {
        if (!alive || authEvent) return;
        if (error) setState(empty('error', null));
        else sync(data.session?.user.id ?? null);
      })
      .catch(() => {
        if (alive && !authEvent) setState(empty('error', null));
      });
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      authEvent = true;
      if (alive) sync(session?.user.id ?? null);
    });
    return () => {
      alive = false;
      requests.current++;
      data.subscription.unsubscribe();
    };
  }, [client, load]);

  // Reload at the lock so every ballot appears without a refresh.
  useEffect(() => {
    if (!locked || !state.userId) return;
    const timer = window.setTimeout(() => void load(state.userId), 0);
    return () => window.clearTimeout(timer);
  }, [locked, state.userId, load]);

  const save = useCallback(
    async (ballot: HalftimeBallot) => {
      const userId = state.userId;
      if (!client || !userId || locked) return 'locked' as const;
      const request = version.current;
      const { data, error } = await client
        .from('halftime_forecasts')
        .upsert(
          {
            league_id: leagueId,
            season,
            voter_id: userId,
            rankings: ballot.rankings,
            championship: ballot.championship,
            loser_bowl: ballot.loserBowl,
          },
          { onConflict: 'league_id,season,voter_id' },
        )
        .select('voter_id,rankings,championship,loser_bowl')
        .single();
      // A different user signed in mid-save; that session reloads itself.
      if (request !== version.current) return 'stale' as const;
      const saved = data as Row | null;
      // Confirm only the exact row the database stored.
      if (
        error ||
        !saved ||
        saved.voter_id !== userId ||
        JSON.stringify(fromRow(saved)) !== JSON.stringify(ballot)
      )
        return error?.message.toLowerCase().includes('locked')
          ? ('locked' as const)
          : ('error' as const);
      setState((s) => ({
        ...s,
        rows: [...s.rows.filter((r) => r.voter_id !== userId), saved],
        filed:
          s.filed === null
            ? null
            : s.filed + (s.rows.some((r) => r.voter_id === userId) ? 0 : 1),
      }));
      return 'saved' as const;
    },
    [client, leagueId, season, locked, state.userId],
  );

  const ownRow = state.rows.find((r) => r.voter_id === state.userId);
  const own =
    ownRow && isCompleteHalftimeBallot(fromRow(ownRow), rosterIds)
      ? fromRow(ownRow)
      : null;
  const revealed: RevealedBallot[] = locked
    ? state.rows.flatMap((row) => {
        const ballot = fromRow(row);
        if (!isCompleteHalftimeBallot(ballot, rosterIds)) return [];
        const profile = state.profiles.find((p) => p.id === row.voter_id);
        return [
          {
            ...ballot,
            voter_id: row.voter_id,
            name: profile?.display_name ?? 'Submitted manager',
            rosterId: profile?.roster_id ?? null,
            preseason:
              state.preseason.find((p) => p.voter_id === row.voter_id)
                ?.rankings ?? null,
          },
        ];
      })
    : [];
  return {
    status: state.status,
    signedIn: Boolean(state.userId),
    locked,
    own,
    filed: state.filed,
    revealed,
    save,
  };
}
