'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type SyntheticEvent,
} from 'react';
import type { User } from '@supabase/supabase-js';
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  LogOut,
  RotateCcw,
  Save,
  UsersRound,
} from 'lucide-react';
import { TeamAvatar } from '@/components/shared/team-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { leagueMembers, memberLoginEmail } from '@/lib/data/member-directory';
import type { SeasonForecastSettings } from '@/lib/data/season-forecasts';
import { getBrowserSupabaseClient } from '@/lib/supabase/browser';
import { cn } from '@/lib/utils';

export type SeasonForecastTeam = {
  rosterId: number;
  teamName: string;
  managerName: string;
  avatar: string | null;
};

type Profile = {
  id: string;
  display_name: string;
};

type ForecastRecord = {
  voter_id: string;
  rankings: number[];
  updated_at: string;
};

type ConsensusRow = SeasonForecastTeam & {
  averagePosition: number;
  firstPlaceVotes: number;
};

function formatLockTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(value));
}

function ForecastRows({
  rankings,
  teamsById,
  compact = false,
}: {
  rankings: number[];
  teamsById: Map<number, SeasonForecastTeam>;
  compact?: boolean;
}) {
  return (
    <div className="divide-y divide-white/[0.05]">
      {rankings.map((rosterId, index) => {
        const team = teamsById.get(rosterId);
        if (!team) return null;

        return (
          <div
            key={rosterId}
            className={cn(
              'grid grid-cols-[28px_minmax(0,1fr)] items-center gap-2',
              compact ? 'py-1.5' : 'py-2.5',
            )}
          >
            <span className="font-mono text-[10px] font-bold text-primary">
              {index + 1}
            </span>
            <span className="min-w-0 truncate text-[11px] font-medium">
              {team.teamName}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function SeasonForecastBallot({
  settings,
  teams,
}: {
  settings: SeasonForecastSettings;
  teams: SeasonForecastTeam[];
}) {
  const supabase = useMemo(() => getBrowserSupabaseClient(), []);
  const teamsById = useMemo(
    () => new Map(teams.map((team) => [team.rosterId, team])),
    [teams],
  );
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [forecasts, setForecasts] = useState<ForecastRecord[]>([]);
  const [profileNames, setProfileNames] = useState<Map<string, string>>(
    new Map(),
  );
  const [ranking, setRanking] = useState<number[]>([]);
  const [locked, setLocked] = useState(settings.locked);
  const [authLoading, setAuthLoading] = useState(Boolean(supabase));
  const [loginOpen, setLoginOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refreshForecasts = useCallback(
    async (member: User | null) => {
      if (!supabase || !member) {
        setProfile(null);
        setForecasts([]);
        setProfileNames(new Map());
        setRanking([]);
        return;
      }

      const profileRequest = supabase
        .from('profiles')
        .select('id,display_name')
        .eq('id', member.id)
        .maybeSingle();
      const forecastRequest = supabase
        .from('season_forecasts')
        .select('voter_id,rankings,updated_at')
        .eq('league_id', settings.leagueId)
        .eq('season', settings.season)
        .order('updated_at');
      const namesRequest = locked
        ? supabase.from('profiles').select('id,display_name')
        : Promise.resolve({ data: [], error: null });

      const [profileResult, forecastResult, namesResult] = await Promise.all([
        profileRequest,
        forecastRequest,
        namesRequest,
      ]);
      const loadedForecasts =
        (forecastResult.data as ForecastRecord[] | null) ?? [];
      const ownForecast = loadedForecasts.find(
        (forecast) => forecast.voter_id === member.id,
      );

      setProfile((profileResult.data as Profile | null) ?? null);
      setForecasts(loadedForecasts);
      setProfileNames(
        new Map(
          ((namesResult.data as Profile[] | null) ?? []).map((item) => [
            item.id,
            item.display_name,
          ]),
        ),
      );
      setRanking(ownForecast?.rankings ?? []);
    },
    [locked, settings.leagueId, settings.season, supabase],
  );

  useEffect(() => {
    const remaining = new Date(settings.lockAt).getTime() - Date.now();
    if (remaining <= 0) return;

    const timer = window.setTimeout(
      () => {
        setLocked(true);
        setMessage('Voting is locked. Every submitted table is now revealed.');
      },
      Math.min(remaining, 2_147_483_647),
    );

    return () => window.clearTimeout(timer);
  }, [settings.lockAt]);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const member = data.session?.user ?? null;
      setUser(member);
      void refreshForecasts(member).finally(() => {
        if (active) setAuthLoading(false);
      });
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const member = session?.user ?? null;
        setUser(member);
        void refreshForecasts(member);
      },
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [refreshForecasts, supabase]);

  const signIn = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || !selectedMember || !password) return;
    setMessage(null);
    setAuthLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: memberLoginEmail(selectedMember),
      password,
    });

    setAuthLoading(false);
    if (error) {
      setMessage('That password did not match this manager account.');
      return;
    }

    setPassword('');
    setLoginOpen(false);
    setMessage(
      locked
        ? 'Signed in. The league predictions are now revealed.'
        : 'Signed in. Build your predicted final table below.',
    );
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessage('Signed out.');
  };

  const addTeam = (rosterId: number) => {
    if (locked || ranking.includes(rosterId)) return;
    setRanking((current) => [...current, rosterId]);
    setMessage(null);
  };

  const moveTeam = (index: number, direction: -1 | 1) => {
    const destination = index + direction;
    if (locked || destination < 0 || destination >= ranking.length) return;

    setRanking((current) => {
      const next = [...current];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next;
    });
    setMessage(null);
  };

  const removeTeam = (rosterId: number) => {
    if (locked) return;
    setRanking((current) => current.filter((id) => id !== rosterId));
    setMessage(null);
  };

  const saveForecast = async () => {
    if (!supabase || !user || locked || ranking.length !== teams.length) return;
    setSaving(true);
    setMessage(null);

    const { error } = await supabase.from('season_forecasts').upsert(
      {
        league_id: settings.leagueId,
        season: settings.season,
        voter_id: user.id,
        rankings: ranking,
      },
      { onConflict: 'league_id,season,voter_id' },
    );

    setSaving(false);
    if (error) {
      setMessage(
        error.message.toLowerCase().includes('locked')
          ? 'Voting has just locked for the season.'
          : 'Your table could not be saved. Please try again.',
      );
      return;
    }

    setForecasts((current) => [
      ...current.filter((forecast) => forecast.voter_id !== user.id),
      {
        voter_id: user.id,
        rankings: ranking,
        updated_at: new Date().toISOString(),
      },
    ]);
    setMessage('Prediction saved. You can change it until the Week 1 lock.');
  };

  const ownForecast = forecasts.find(
    (forecast) => forecast.voter_id === user?.id,
  );
  const unrankedTeams = teams.filter(
    (team) => !ranking.includes(team.rosterId),
  );
  const consensus = useMemo<ConsensusRow[]>(() => {
    if (!locked || forecasts.length === 0) return [];

    return teams
      .map((team) => {
        const positions = forecasts.map(
          (forecast) => forecast.rankings.indexOf(team.rosterId) + 1,
        );

        return {
          ...team,
          averagePosition:
            positions.reduce((total, position) => total + position, 0) /
            positions.length,
          firstPlaceVotes: positions.filter((position) => position === 1)
            .length,
        };
      })
      .sort(
        (a, b) =>
          a.averagePosition - b.averagePosition ||
          b.firstPlaceVotes - a.firstPlaceVotes ||
          a.rosterId - b.rosterId,
      );
  }, [forecasts, locked, teams]);

  return (
    <Card className="linear-panel gap-0 py-0">
      <div className="flex flex-col gap-3 border-b border-white/[0.065] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'flex size-9 shrink-0 items-center justify-center rounded-lg border',
              locked
                ? 'border-amber-300/15 bg-amber-300/[0.055] text-amber-200'
                : 'border-primary/15 bg-primary/[0.07] text-primary',
            )}
          >
            {locked ? (
              <LockKeyhole className="size-4" />
            ) : (
              <UsersRound className="size-4" />
            )}
          </span>
          <div>
            <p className="ui-kicker">Manager predictions</p>
            <h2 className="mt-1 text-base font-semibold sm:text-lg">
              {locked ? 'The league has spoken' : 'Build your final table'}
            </h2>
            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
              {locked
                ? `${forecasts.length} submitted tables are frozen and revealed below.`
                : `Rank all 12 teams before ${formatLockTime(settings.lockAt)}. Every table stays private until then.`}
            </p>
          </div>
        </div>

        {user && profile ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.065] bg-white/[0.025] p-2.5 lg:min-w-64">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">
                {profile.display_name}
              </p>
              <p className="mt-0.5 text-[9px] text-muted-foreground">
                {locked
                  ? 'Predictions revealed'
                  : ownForecast
                    ? 'Table submitted'
                    : `${ranking.length} of ${teams.length} ranked`}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={signOut}
              aria-label="Sign out"
            >
              <LogOut />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setLoginOpen((open) => !open)}
            disabled={!supabase || authLoading}
          >
            {authLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <LogIn />
            )}
            {locked ? 'Sign in to reveal' : 'Sign in to predict'}
          </Button>
        )}
      </div>

      {loginOpen && !user && (
        <form
          onSubmit={signIn}
          className="grid gap-3 border-b border-white/[0.065] p-4 sm:grid-cols-[minmax(180px,1fr)_minmax(160px,1fr)_auto] sm:p-5"
        >
          <Select
            value={selectedMember}
            onValueChange={(value) => setSelectedMember(value ?? '')}
          >
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Choose your manager" />
            </SelectTrigger>
            <SelectContent>
              {leagueMembers.map((member) => (
                <SelectItem key={member.loginSlug} value={member.loginSlug}>
                  {member.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="h-9"
          />
          <Button
            type="submit"
            size="lg"
            disabled={!selectedMember || !password || authLoading}
          >
            Sign in
          </Button>
        </form>
      )}

      {!settings.databaseReady && (
        <p className="border-b border-white/[0.065] px-4 py-3 text-[11px] text-amber-200 sm:px-5">
          Season predictions are being connected. Please check back shortly.
        </p>
      )}

      {message && (
        <output className="block border-b border-white/[0.065] px-4 py-3 text-[11px] text-muted-foreground sm:px-5">
          {message}
        </output>
      )}

      {!locked && user && settings.databaseReady && (
        <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <div className="border-b border-white/[0.065] p-4 sm:p-5 lg:border-r lg:border-b-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold">Your predicted order</p>
                <p className="mt-0.5 text-[9px] text-muted-foreground">
                  Tap the remaining teams in the order you expect them to
                  finish.
                </p>
              </div>
              {ranking.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRanking([]);
                    setMessage(null);
                  }}
                >
                  <RotateCcw /> Reset
                </Button>
              )}
            </div>

            <div className="mt-4 space-y-2">
              {ranking.map((rosterId, index) => {
                const team = teamsById.get(rosterId);
                if (!team) return null;

                return (
                  <div
                    key={rosterId}
                    className="grid grid-cols-[28px_auto_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-white/[0.065] bg-white/[0.018] p-2"
                  >
                    <span className="text-center font-mono text-xs font-black text-primary">
                      {index + 1}
                    </span>
                    <TeamAvatar
                      avatar={team.avatar}
                      name={team.teamName}
                      className="size-8"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-[11px] font-semibold">
                        {team.teamName}
                      </span>
                      <span className="block truncate text-[9px] text-muted-foreground">
                        {team.managerName}
                      </span>
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => moveTeam(index, -1)}
                        disabled={index === 0}
                        aria-label={`Move ${team.teamName} up`}
                      >
                        <ArrowUp />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => moveTeam(index, 1)}
                        disabled={index === ranking.length - 1}
                        aria-label={`Move ${team.teamName} down`}
                      >
                        <ArrowDown />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeTeam(rosterId)}
                        aria-label={`Remove ${team.teamName}`}
                      >
                        ×
                      </Button>
                    </span>
                  </div>
                );
              })}

              {ranking.length === 0 && (
                <div className="rounded-lg border border-dashed border-white/[0.09] px-4 py-8 text-center text-[11px] text-muted-foreground">
                  Your table will appear here as you choose teams.
                </div>
              )}
            </div>

            <Button
              className="mt-4 w-full"
              onClick={saveForecast}
              disabled={ranking.length !== teams.length || saving}
            >
              {saving ? (
                <LoaderCircle className="animate-spin" />
              ) : ownForecast ? (
                <Save />
              ) : (
                <Check />
              )}
              {ranking.length === teams.length
                ? ownForecast
                  ? 'Update prediction'
                  : 'Submit prediction'
                : `${teams.length - ranking.length} teams left to rank`}
            </Button>
          </div>

          <div className="p-4 sm:p-5">
            <p className="text-xs font-semibold">Teams still to rank</p>
            <p className="mt-0.5 text-[9px] text-muted-foreground">
              Your next choice takes the next available position.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {unrankedTeams.map((team) => (
                <button
                  key={team.rosterId}
                  type="button"
                  onClick={() => addTeam(team.rosterId)}
                  className="flex min-w-0 items-center gap-2 rounded-lg border border-white/[0.065] bg-white/[0.018] p-2.5 text-left transition-colors hover:border-primary/20 hover:bg-primary/[0.035]"
                >
                  <TeamAvatar
                    avatar={team.avatar}
                    name={team.teamName}
                    className="size-8 shrink-0"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] font-semibold">
                      {team.teamName}
                    </span>
                    <span className="block truncate text-[9px] text-muted-foreground">
                      {team.managerName}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            {unrankedTeams.length === 0 && (
              <div className="mt-4 rounded-lg border border-primary/15 bg-primary/[0.04] px-3 py-4 text-center text-[11px] text-primary">
                All 12 ranked. Review your order, then save it.
              </div>
            )}
          </div>
        </div>
      )}

      {!locked && !user && (
        <div className="px-5 py-10 text-center">
          <p className="text-xs text-muted-foreground">
            Sign in with your existing manager account to submit your table.
          </p>
        </div>
      )}

      {locked && user && consensus.length > 0 && (
        <div>
          <div className="border-b border-white/[0.065] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold">League consensus</p>
                <p className="mt-0.5 text-[9px] text-muted-foreground">
                  Ordered by the average position across every submitted table.
                </p>
              </div>
              <Badge
                variant="outline"
                className="border-primary/15 bg-primary/[0.055] text-[9px] text-primary"
              >
                {forecasts.length} ballots
              </Badge>
            </div>
            <div className="mt-4 divide-y divide-white/[0.055]">
              {consensus.map((team, index) => (
                <div
                  key={team.rosterId}
                  className="grid grid-cols-[28px_auto_minmax(0,1fr)_auto] items-center gap-2 py-2.5"
                >
                  <span className="font-mono text-xs font-black text-primary">
                    {index + 1}
                  </span>
                  <TeamAvatar
                    avatar={team.avatar}
                    name={team.teamName}
                    className="size-8"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] font-semibold sm:text-xs">
                      {team.teamName}
                    </span>
                    <span className="block truncate text-[9px] text-muted-foreground">
                      {team.managerName}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block font-mono text-[11px] font-bold">
                      {team.averagePosition.toFixed(1)} avg
                    </span>
                    <span className="block text-[8px] text-muted-foreground">
                      {team.firstPlaceVotes}{' '}
                      {team.firstPlaceVotes === 1 ? 'first' : 'firsts'}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <p className="text-xs font-semibold">Every manager’s prediction</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {forecasts.map((forecast) => (
                <details
                  key={forecast.voter_id}
                  className="group rounded-lg border border-white/[0.065] bg-white/[0.018]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-3 text-[11px] font-semibold">
                    <span>
                      {profileNames.get(forecast.voter_id) ?? 'League manager'}
                      {forecast.voter_id === user.id && (
                        <span className="ml-1.5 text-[8px] uppercase tracking-wide text-primary">
                          You
                        </span>
                      )}
                    </span>
                    <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-white/[0.055] px-3 pb-2">
                    <ForecastRows
                      rankings={forecast.rankings}
                      teamsById={teamsById}
                      compact
                    />
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}

      {locked && user && consensus.length === 0 && (
        <div className="px-5 py-10 text-center">
          <p className="text-xs text-muted-foreground">
            No complete manager tables were submitted before the lock.
          </p>
        </div>
      )}

      {locked && !user && (
        <div className="px-5 py-10 text-center">
          <p className="text-xs text-muted-foreground">
            Sign in to reveal the league consensus and every manager’s table.
          </p>
        </div>
      )}
    </Card>
  );
}
