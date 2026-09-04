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
  Check,
  ChevronDown,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  LogOut,
  ShieldCheck,
  Trophy,
  UserRound,
  Vote,
} from 'lucide-react';
import { TeamAvatar } from '@/components/shared/team-avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import type {
  PredictionMatchup,
  PredictionPlayer,
  PredictionTeam,
  PredictionWeekData,
} from '@/lib/data/predictions';
import { getBrowserSupabaseClient } from '@/lib/supabase/browser';
import { cn } from '@/lib/utils';

type Profile = {
  id: string;
  display_name: string;
  roster_id: number | null;
};

type VoteRecord = {
  matchup_id: number;
  voter_id: string;
  selected_roster_id: number;
};

type VoterDisplay = {
  id: string;
  name: string;
  isCurrentUser: boolean;
};

type LeaderboardRow = {
  voter_id: string;
  display_name: string;
  completed_picks: number;
  correct_picks: number;
  accuracy: number | string;
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

function recordFor(team: PredictionTeam) {
  return `${team.wins}-${team.losses}${team.ties ? `-${team.ties}` : ''}`;
}

function PlayerRow({ player }: { player: PredictionPlayer }) {
  return (
    <div className="grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-white/[0.055] py-2.5 last:border-0">
      <span className="font-mono text-[10px] font-bold text-primary">
        {player.slot.replace('_FLEX', '')}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium">
          {player.name}
        </span>
        <span className="mt-0.5 block text-[10px] text-muted-foreground">
          {player.position} · {player.nflTeam}
        </span>
      </span>
      <span className="font-mono text-[11px] text-muted-foreground">
        {player.projectedPoints.toFixed(1)}
      </span>
    </div>
  );
}

function LineupColumn({ team }: { team: PredictionTeam }) {
  return (
    <div className="min-w-0 rounded-lg border border-white/[0.065] bg-black/10 p-3">
      <div className="mb-2 flex items-center gap-2">
        <TeamAvatar
          avatar={team.avatar}
          name={team.teamName}
          className="size-7"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{team.teamName}</p>
          <p className="text-[10px] text-muted-foreground">Starting lineup</p>
        </div>
      </div>
      <div>
        {team.starters.map((player) => (
          <PlayerRow key={player.id} player={player} />
        ))}
      </div>
      <details className="group mt-2">
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-1 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground">
          Bench · {team.bench.length}
          <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
        </summary>
        <div>
          {team.bench.length ? (
            team.bench.map((player) => (
              <PlayerRow key={player.id} player={player} />
            ))
          ) : (
            <p className="py-3 text-[11px] text-muted-foreground">
              No bench players yet.
            </p>
          )}
        </div>
      </details>
    </div>
  );
}

function TeamChoice({
  team,
  matchup,
  selected,
  voters,
  votePercentage,
  locked,
  finalized,
  signedIn,
  disabled,
  pending,
  onPick,
}: {
  team: PredictionTeam;
  matchup: PredictionMatchup;
  selected: boolean;
  voters: VoterDisplay[];
  votePercentage: number;
  locked: boolean;
  finalized: boolean;
  signedIn: boolean;
  disabled: boolean;
  pending: boolean;
  onPick: (matchup: PredictionMatchup, rosterId: number) => void;
}) {
  return (
    <div
      className={cn(
        'min-w-0 rounded-xl border p-2.5 transition-colors sm:p-3.5',
        selected
          ? 'border-primary/25 bg-primary/[0.035]'
          : 'border-white/[0.065] bg-white/[0.018]',
      )}
    >
      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2 sm:flex sm:gap-2.5">
        <TeamAvatar
          avatar={team.avatar}
          name={team.teamName}
          className="size-8 sm:size-10"
        />
        <div className="col-span-2 mt-2 min-w-0 sm:order-none sm:col-span-1 sm:mt-0 sm:flex-1">
          <p className="truncate text-xs font-bold leading-tight sm:text-[15px]">
            {team.teamName}
          </p>
          <p className="mt-1 truncate text-[9px] text-muted-foreground sm:text-[11px]">
            {team.ownerName} · {recordFor(team)}
          </p>
        </div>
        <div className="col-start-2 row-start-1 shrink-0 text-right sm:order-none sm:col-auto sm:row-auto">
          <p className="font-mono text-xl font-black tracking-[-0.055em] sm:text-[28px]">
            {team.projectedScore.toFixed(1)}
          </p>
          <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-muted-foreground sm:text-[10px] sm:tracking-[0.12em]">
            Projected
          </p>
        </div>
      </div>
      {finalized && (
        <p className="mt-2 text-right font-mono text-[11px] font-semibold text-foreground/80">
          Final · {team.actualScore.toFixed(1)}
        </p>
      )}
      {!locked ? (
        <Button
          variant={selected ? 'default' : 'outline'}
          size="sm"
          className="mt-3 w-full"
          disabled={disabled || pending}
          onClick={() => onPick(matchup, team.rosterId)}
        >
          {pending ? (
            <LoaderCircle className="animate-spin" />
          ) : selected ? (
            <Check />
          ) : (
            <Vote />
          )}
          {selected ? (
            'Your pick'
          ) : (
            <>
              <span className="sm:hidden">Pick this team</span>
              <span className="hidden sm:inline">Pick {team.teamName}</span>
            </>
          )}
        </Button>
      ) : !signedIn ? (
        <p className="mt-3 border-t border-white/[0.06] pt-3 text-[11px] text-muted-foreground">
          Sign in to reveal voters
        </p>
      ) : (
        <div className="mt-3 border-t border-white/[0.06] pt-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold text-foreground/80">
              {voters.length} {voters.length === 1 ? 'vote' : 'votes'} ·{' '}
              {Math.round(votePercentage)}%
            </p>
            {selected && (
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-1 text-[10px] font-semibold text-primary">
                <Check className="size-3" /> Your pick
              </span>
            )}
          </div>
          {voters.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {voters.map((voter) => (
                <span
                  key={voter.id}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium',
                    voter.isCurrentUser
                      ? 'bg-primary/[0.12] text-primary'
                      : 'bg-white/[0.055] text-foreground/75',
                  )}
                >
                  {voter.name}
                  {voter.isCurrentUser && (
                    <span className="text-[9px] font-bold uppercase tracking-wide">
                      You
                    </span>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-muted-foreground">No picks</p>
          )}
        </div>
      )}
    </div>
  );
}

function MatchupPanel({
  matchup,
  index,
  locked,
  finalized,
  user,
  votes,
  profileNames,
  databaseReady,
  pendingMatchup,
  onPick,
  onRequireLogin,
}: {
  matchup: PredictionMatchup;
  index: number;
  locked: boolean;
  finalized: boolean;
  user: User | null;
  votes: VoteRecord[];
  profileNames: Map<string, string>;
  databaseReady: boolean;
  pendingMatchup: number | null;
  onPick: (matchup: PredictionMatchup, rosterId: number) => void;
  onRequireLogin: () => void;
}) {
  const [lineupsOpen, setLineupsOpen] = useState(false);
  const matchupVotes = votes.filter(
    (vote) => vote.matchup_id === matchup.databaseId,
  );
  const ownVote = matchupVotes.find((vote) => vote.voter_id === user?.id);
  const votersFor = (rosterId: number) =>
    matchupVotes
      .filter((vote) => vote.selected_roster_id === rosterId)
      .map((vote) => ({
        id: vote.voter_id,
        name: profileNames.get(vote.voter_id) ?? 'League member',
        isCurrentUser: vote.voter_id === user?.id,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  const homeVoters = votersFor(matchup.home.rosterId);
  const awayVoters = votersFor(matchup.away.rosterId);
  const totalVotes = homeVoters.length + awayVoters.length;
  const homeVotePercentage = totalVotes
    ? (homeVoters.length / totalVotes) * 100
    : 0;
  const awayVotePercentage = totalVotes ? 100 - homeVotePercentage : 0;
  const pick = (selectedMatchup: PredictionMatchup, rosterId: number) => {
    if (!user) {
      onRequireLogin();
      return;
    }
    onPick(selectedMatchup, rosterId);
  };

  return (
    <Card className="linear-panel gap-0 py-0">
      <div className="flex items-center justify-between border-b border-white/[0.065] px-3.5 py-2.5 sm:px-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          Matchup {index + 1}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground">
          {finalized
            ? 'Final'
            : locked
              ? user
                ? `${totalVotes} ${totalVotes === 1 ? 'vote' : 'votes'}`
                : 'Locked'
              : 'Voting open'}
        </span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_12px_minmax(0,1fr)] items-stretch gap-1.5 px-2.5 py-3 sm:grid-cols-[minmax(0,1fr)_20px_minmax(0,1fr)] sm:gap-3 sm:px-4">
        <TeamChoice
          team={matchup.home}
          matchup={matchup}
          selected={ownVote?.selected_roster_id === matchup.home.rosterId}
          voters={homeVoters}
          votePercentage={homeVotePercentage}
          locked={locked}
          finalized={finalized}
          signedIn={Boolean(user)}
          disabled={!databaseReady || matchup.databaseId == null}
          pending={pendingMatchup === matchup.databaseId}
          onPick={pick}
        />
        <div className="flex items-center justify-center">
          <span className="font-mono text-[10px] font-black uppercase text-muted-foreground/50">
            vs
          </span>
        </div>
        <TeamChoice
          team={matchup.away}
          matchup={matchup}
          selected={ownVote?.selected_roster_id === matchup.away.rosterId}
          voters={awayVoters}
          votePercentage={awayVotePercentage}
          locked={locked}
          finalized={finalized}
          signedIn={Boolean(user)}
          disabled={!databaseReady || matchup.databaseId == null}
          pending={pendingMatchup === matchup.databaseId}
          onPick={pick}
        />
      </div>
      {locked && user && totalVotes > 0 && (
        <div className="px-3.5 pb-3 sm:px-4">
          <div className="mb-1.5 flex items-center justify-between text-[10px] font-medium text-muted-foreground">
            <span>Community split</span>
            <span>
              {Math.round(homeVotePercentage)}% ·{' '}
              {Math.round(awayVotePercentage)}%
            </span>
          </div>
          <div
            className="flex h-1.5 overflow-hidden rounded-full bg-white/[0.055]"
            aria-hidden="true"
          >
            <span
              className="h-full bg-primary transition-[width]"
              style={{ width: `${homeVotePercentage}%` }}
            />
            <span
              className="h-full flex-1 bg-amber-300/60"
              aria-hidden="true"
            />
          </div>
        </div>
      )}
      <Accordion className="border-t border-white/[0.065] px-3.5 sm:px-4">
        <AccordionItem
          value={`matchup-${matchup.sleeperMatchupId}`}
          onOpenChange={setLineupsOpen}
        >
          <AccordionTrigger className="my-1 w-full px-2 py-2.5 text-[11px] font-semibold uppercase tracking-[0.11em] text-muted-foreground hover:bg-white/[0.03] hover:no-underline hover:text-foreground">
            {lineupsOpen ? 'Hide lineups' : 'View both lineups'}
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="grid gap-3 md:grid-cols-2">
              <LineupColumn team={matchup.home} />
              <LineupColumn team={matchup.away} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}

export function PredictionCentre({ data }: { data: PredictionWeekData }) {
  const supabase = useMemo(() => getBrowserSupabaseClient(), []);
  const matchupIds = useMemo(
    () =>
      data.matchups.flatMap((matchup) =>
        matchup.databaseId == null ? [] : [matchup.databaseId],
      ),
    [data.matchups],
  );
  const [user, setUser] = useState<User | null>(null);
  const [locked, setLocked] = useState(data.locked);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [votes, setVotes] = useState<VoteRecord[]>([]);
  const [profileNames, setProfileNames] = useState<Map<string, string>>(
    new Map(),
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [authLoading, setAuthLoading] = useState(Boolean(supabase));
  const [loginOpen, setLoginOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [pendingMatchup, setPendingMatchup] = useState<number | null>(null);

  const refreshMemberData = useCallback(
    async (member: User | null) => {
      if (!supabase || !member) {
        setProfile(null);
        setVotes([]);
        setProfileNames(new Map());
        setLeaderboard([]);
        return;
      }

      const profileRequest = supabase
        .from('profiles')
        .select('id,display_name,roster_id')
        .eq('id', member.id)
        .maybeSingle();
      const votesRequest = matchupIds.length
        ? supabase
            .from('prediction_votes')
            .select('matchup_id,voter_id,selected_roster_id')
            .in('matchup_id', matchupIds)
        : Promise.resolve({ data: [], error: null });
      const namesRequest = locked
        ? supabase.from('profiles').select('id,display_name')
        : Promise.resolve({ data: [], error: null });
      const leaderboardRequest = supabase
        .from('prediction_leaderboard')
        .select('voter_id,display_name,completed_picks,correct_picks,accuracy')
        .order('correct_picks', { ascending: false })
        .order('accuracy', { ascending: false });

      const [profileResult, votesResult, namesResult, leaderboardResult] =
        await Promise.all([
          profileRequest,
          votesRequest,
          namesRequest,
          leaderboardRequest,
        ]);

      setProfile((profileResult.data as Profile | null) ?? null);
      setVotes((votesResult.data as VoteRecord[] | null) ?? []);
      setProfileNames(
        new Map(
          (
            (namesResult.data as Array<{ id: string; display_name: string }>) ??
            []
          ).map((item) => [item.id, item.display_name]),
        ),
      );
      setLeaderboard((leaderboardResult.data as LeaderboardRow[] | null) ?? []);
    },
    [locked, matchupIds, supabase],
  );

  useEffect(() => {
    const remaining = new Date(data.lockAt).getTime() - Date.now();
    if (remaining <= 0) return;

    const timer = window.setTimeout(
      () => {
        setLocked(true);
        setMessage(null);
      },
      Math.min(remaining, 2_147_483_647),
    );
    return () => window.clearTimeout(timer);
  }, [data.lockAt]);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    void supabase.auth.getSession().then(({ data: sessionData }) => {
      if (!active) return;
      const member = sessionData.session?.user ?? null;
      setUser(member);
      void refreshMemberData(member).finally(() => {
        if (active) setAuthLoading(false);
      });
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const member = session?.user ?? null;
        setUser(member);
        void refreshMemberData(member);
      },
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [refreshMemberData, supabase]);

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
        ? 'Signed in. Locked picks and voter names are now revealed.'
        : 'Signed in. Your picks will now be saved.',
    );
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessage('Signed out.');
  };

  const castVote = async (
    matchup: PredictionMatchup,
    selectedRosterId: number,
  ) => {
    if (!supabase || !user || matchup.databaseId == null || locked) return;
    const matchupId = matchup.databaseId;
    setPendingMatchup(matchupId);
    setMessage(null);
    const { error } = await supabase.from('prediction_votes').upsert(
      {
        matchup_id: matchupId,
        voter_id: user.id,
        selected_roster_id: selectedRosterId,
      },
      { onConflict: 'matchup_id,voter_id' },
    );
    setPendingMatchup(null);
    if (error) {
      setMessage(
        error.message.toLowerCase().includes('locked')
          ? 'Voting has just locked for this week.'
          : 'Your pick could not be saved. Please try again.',
      );
      return;
    }
    setVotes((current) => [
      ...current.filter(
        (vote) => vote.matchup_id !== matchupId || vote.voter_id !== user.id,
      ),
      {
        matchup_id: matchupId,
        voter_id: user.id,
        selected_roster_id: selectedRosterId,
      },
    ]);
    setMessage('Pick saved. You can change it any time before the lock.');
  };

  const picksMade = votes.filter((vote) => vote.voter_id === user?.id).length;

  return (
    <div className="space-y-4 sm:space-y-5">
      <Card className="linear-panel gap-0 p-3.5 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
                <Vote className="size-4" />
              )}
            </span>
            <div>
              <p className="text-xs font-semibold">
                {locked ? 'Week locked' : 'Anonymous voting is open'}
              </p>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                {locked
                  ? user
                    ? 'All picks are frozen. Vote totals and manager names are visible below.'
                    : 'All picks are frozen. Sign in to reveal the manager names behind each choice.'
                  : `All six picks close ${formatLockTime(data.lockAt)}. Nobody else can see your choices before then.`}
              </p>
            </div>
          </div>

          {user && profile ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.065] bg-white/[0.025] p-2.5 lg:min-w-64">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="size-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">
                    {profile.display_name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {locked
                      ? 'Picks revealed'
                      : `${picksMade} of ${data.matchups.length} picks saved`}
                  </p>
                  {!locked && data.matchups.length > 0 && (
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                      <span
                        className="block h-full bg-primary transition-[width]"
                        style={{
                          width: `${(picksMade / data.matchups.length) * 100}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
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
              Sign in to vote
            </Button>
          )}
        </div>

        {loginOpen && !user && (
          <form
            onSubmit={signIn}
            className="mt-4 grid gap-3 border-t border-white/[0.065] pt-4 sm:grid-cols-[minmax(180px,1fr)_minmax(160px,1fr)_auto]"
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

        {!supabase && (
          <p className="mt-3 text-[11px] text-amber-200">
            Voting is being connected. Matchups and projections still update
            from Sleeper.
          </p>
        )}
        {message && (
          <output className="mt-3 block text-[11px] text-muted-foreground">
            {message}
          </output>
        )}
      </Card>

      {data.matchups.length ? (
        <div className="space-y-3">
          {data.matchups.map((matchup, index) => (
            <MatchupPanel
              key={matchup.sleeperMatchupId}
              matchup={matchup}
              index={index}
              locked={locked}
              finalized={data.finalized}
              user={user}
              votes={votes}
              profileNames={profileNames}
              databaseReady={data.databaseReady}
              pendingMatchup={pendingMatchup}
              onPick={castVote}
              onRequireLogin={() => setLoginOpen(true)}
            />
          ))}
        </div>
      ) : (
        <Card className="linear-panel items-center px-5 py-14 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/[0.06] text-primary">
            <ShieldCheck className="size-5" />
          </span>
          <h2 className="mt-1 text-base font-semibold">Ready for Week 1</h2>
          <p className="max-w-md text-xs leading-6 text-muted-foreground">
            Sleeper will publish the six matchups after the draft. They will
            appear here automatically with projected scores, voting and full
            lineups.
          </p>
        </Card>
      )}

      {user && leaderboard.some((row) => row.completed_picks > 0) && (
        <Card className="linear-panel gap-0 py-0">
          <div className="flex items-center gap-2 border-b border-white/[0.065] px-4 py-3.5 sm:px-5">
            <Trophy className="size-4 text-primary" />
            <div>
              <p className="text-xs font-semibold">Season prediction table</p>
              <p className="mt-0.5 text-[9px] text-muted-foreground">
                One point for every correct matchup winner
              </p>
            </div>
          </div>
          <div className="divide-y divide-white/[0.055] px-4 sm:px-5">
            {leaderboard.map((row, index) => (
              <div
                key={row.voter_id}
                className="grid grid-cols-[28px_minmax(0,1fr)_auto_auto] items-center gap-3 py-3 text-xs"
              >
                <span className="font-mono text-[10px] text-muted-foreground">
                  {index + 1}
                </span>
                <span className="truncate font-medium">{row.display_name}</span>
                <span className="font-mono font-bold text-primary">
                  {row.correct_picks}
                </span>
                <span className="w-12 text-right font-mono text-[10px] text-muted-foreground">
                  {Number(row.accuracy).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
