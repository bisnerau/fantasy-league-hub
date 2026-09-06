'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import type { PredictionWeekData } from '@/lib/data/predictions';
import { getBrowserSupabaseClient } from '@/lib/supabase/browser';
import type { VoteRecord } from '@/lib/predictions/votes';
export type { VoteRecord } from '@/lib/predictions/votes';

export type Profile = {
  id: string;
  display_name: string;
  roster_id: number | null;
};
export type LeaderboardRow = {
  voter_id: string;
  display_name: string;
  completed_picks: number;
  correct_picks: number;
  accuracy: number | string;
};

const empty = {
  profile: null as Profile | null,
  votes: [] as VoteRecord[],
  names: [] as { id: string; display_name: string }[],
  weeklyLeaderboard: [] as LeaderboardRow[],
  seasonLeaderboard: [] as LeaderboardRow[],
};

export function usePredictionMember(data: PredictionWeekData, locked: boolean) {
  const supabase = useMemo(() => getBrowserSupabaseClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [memberData, setMemberData] = useState(empty);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const requestId = useRef(0);
  const refresh = useCallback(() => setReload((value) => value + 1), []);
  const matchupIds = useMemo(
    () =>
      data.matchups.flatMap((matchup) =>
        matchup.databaseId == null ? [] : [matchup.databaseId],
      ),
    [data.matchups],
  );

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    let authEventReceived = false;
    const applySession = (member: User | null) => {
      if (!active) return;
      setUser((previous) => {
        // Keep the existing identity object on token refresh, avoiding a data reload.
        return previous?.id === member?.id ? previous : member;
      });
      if (!member) {
        requestId.current += 1;
        setMemberData(empty);
        setLoading(false);
        setError(null);
      }
    };
    void supabase.auth
      .getSession()
      .then(({ data: session, error: sessionError }) => {
        if (!active || authEventReceived) return;
        if (sessionError) {
          setError('Your session could not be restored. Please sign in again.');
          setLoading(false);
        } else applySession(session.session?.user ?? null);
      })
      .catch(() => {
        if (active && !authEventReceived) {
          setError('Sign-in is unavailable. Please try again.');
          setLoading(false);
        }
      });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        authEventReceived = true;
        applySession(session?.user ?? null);
      },
    );
    return () => {
      active = false;
      requestId.current += 1;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !user) return;
    let active = true;
    const request = ++requestId.current;
    // A microtask keeps network work outside Supabase's auth callback/lock.
    void Promise.resolve().then(async () => {
      if (!active) return;
      setLoading(true);
      setError(null);
      setMemberData((previous) =>
        previous.profile?.id === user.id ? previous : empty,
      );
      try {
        const columns =
          'voter_id,display_name,completed_picks,correct_picks,accuracy';
        const leaderboard = (table: string) =>
          supabase
            .from(table)
            .select(columns)
            .eq('league_id', data.leagueId)
            .eq('season', Number(data.season))
            .order('correct_picks', { ascending: false })
            .order('accuracy', { ascending: false })
            .order('display_name');
        const [profile, votes, names, weekly, season] = await Promise.all([
          supabase
            .from('profiles')
            .select('id,display_name,roster_id')
            .eq('id', user.id)
            .maybeSingle(),
          matchupIds.length
            ? supabase
                .from('prediction_votes')
                .select('matchup_id,voter_id,selected_roster_id')
                .in('matchup_id', matchupIds)
            : Promise.resolve({ data: [], error: null }),
          locked
            ? supabase.from('profiles').select('id,display_name')
            : Promise.resolve({ data: [], error: null }),
          leaderboard('prediction_weekly_leaderboard').eq('week', data.week),
          leaderboard('prediction_season_leaderboard'),
        ]);
        if (!active || request !== requestId.current) return;
        if (
          [profile, votes, names, weekly, season].some((result) => result.error)
        )
          throw new Error('Member data unavailable');
        if (!profile.data) throw new Error('Member profile unavailable');
        setMemberData({
          profile: profile.data as Profile,
          votes: votes.data as VoteRecord[],
          names: names.data as { id: string; display_name: string }[],
          weeklyLeaderboard: weekly.data as LeaderboardRow[],
          seasonLeaderboard: season.data as LeaderboardRow[],
        });
      } catch {
        if (active && request === requestId.current)
          setError(
            navigator.onLine
              ? 'Your picks and standings could not be loaded. Retry before making changes.'
              : 'You’re offline. Reconnect to load your saved picks and standings.',
          );
      } finally {
        if (active && request === requestId.current) setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [
    data.leagueId,
    data.season,
    data.week,
    locked,
    matchupIds,
    reload,
    supabase,
    user,
  ]);

  const recordSavedVote = useCallback(
    (vote: VoteRecord) => {
      requestId.current += 1;
      setLoading(false);
      setMemberData((previous) => ({
        ...previous,
        votes: [
          ...previous.votes.filter(
            (saved) =>
              saved.matchup_id !== vote.matchup_id ||
              saved.voter_id !== vote.voter_id,
          ),
          vote,
        ],
      }));
      refresh();
    },
    [refresh],
  );

  return {
    supabase,
    user,
    ...memberData,
    loading,
    error,
    refresh,
    recordSavedVote,
  };
}
