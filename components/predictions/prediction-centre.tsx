'use client';

import { useEffect, useState, useRef, type SyntheticEvent } from 'react';
import type { User } from '@supabase/supabase-js';
import {
  usePredictionMember,
  type LeaderboardRow,
  type VoteRecord,
} from './use-prediction-member';
import { formatLockTime, signInErrorMessage } from '@/lib/predictions/rules';
import { formatScore } from '@/lib/sleeper/scores';
import { persistPick } from '@/lib/predictions/votes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Check,
  ChevronDown,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  LogOut,
  ShieldCheck,
  Trophy,
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
import { cn } from '@/lib/utils';

type VoterDisplay = {
  id: string;
  name: string;
  isCurrentUser: boolean;
};

type PredictionView = 'weekly' | 'standings';

function recordFor(team: PredictionTeam) {
  return `${team.wins}-${team.losses}${team.ties ? `-${team.ties}` : ''}`;
}

function PredictionTable({
  title,
  subtitle,
  rows,
  currentUserId,
  emptyMessage,
}: {
  title: string;
  subtitle: string;
  rows: LeaderboardRow[];
  currentUserId?: string;
  emptyMessage?: string;
}) {
  return (
    <section className="linear-panel overflow-hidden rounded-xl">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <h2 className="text-base font-bold">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {subtitle}
        </p>
      </div>
      {emptyMessage ? (
        <p className="px-5 py-8 text-sm leading-6 text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <Table>
          <caption className="sr-only">
            {title}. Ranked by correct predictions; equal totals share a rank.
          </caption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col" className="w-12 pl-4 text-xs">
                Rank
              </TableHead>
              <TableHead scope="col" className="text-xs">
                Manager
              </TableHead>
              <TableHead scope="col" className="text-right text-xs">
                Correct
              </TableHead>
              <TableHead scope="col" className="pr-4 text-right text-xs">
                Accuracy
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.voter_id}
                className={row.voter_id === currentUserId ? 'bg-primary/5' : ''}
              >
                <TableCell className="pl-4 font-mono text-xs text-muted-foreground">
                  {rows.findIndex(
                    (candidate) =>
                      candidate.correct_picks === row.correct_picks &&
                      Number(candidate.accuracy) === Number(row.accuracy),
                  ) + 1}
                </TableCell>
                <TableCell className="whitespace-normal text-sm font-medium">
                  {row.display_name}
                  {row.voter_id === currentUserId && (
                    <span className="ml-1 text-xs text-primary">(you)</span>
                  )}
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-primary">
                  {row.correct_picks}/{row.completed_picks}
                </TableCell>
                <TableCell className="pr-4 text-right font-mono text-xs text-muted-foreground">
                  {Number(row.accuracy).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}

function PlayerRow({ player }: { player: PredictionPlayer }) {
  return (
    <div className="grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-border py-2.5 last:border-0">
      <span className="font-mono text-xs font-bold text-primary">
        {player.slot.replace('_FLEX', '')}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium">
          {player.name}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {player.position} · {player.nflTeam}
        </span>
      </span>
      <span className="font-mono text-[11px] text-muted-foreground">
        {formatScore(player.projectedPoints)}
      </span>
    </div>
  );
}

function LineupColumn({ team }: { team: PredictionTeam }) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-muted/20 p-3">
      <div className="mb-2 flex items-center gap-2">
        <TeamAvatar
          avatar={team.avatar}
          name={team.teamName}
          className="size-7"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{team.teamName}</p>
          <p className="text-xs text-muted-foreground">Starting lineup</p>
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
  votersReady,
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
  votersReady: boolean;
  onPick: (matchup: PredictionMatchup, rosterId: number) => void;
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col rounded-lg border p-3 transition-colors duration-150 sm:p-4',
        selected
          ? 'border-primary bg-primary/5'
          : 'border-border bg-background',
      )}
    >
      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2 sm:flex sm:gap-2.5">
        <TeamAvatar
          avatar={team.avatar}
          name={team.teamName}
          className="size-8 sm:size-10"
        />
        <div className="col-span-2 mt-2 min-w-0 sm:order-none sm:col-span-1 sm:mt-0 sm:flex-1">
          <p className="break-words text-sm font-bold leading-snug sm:text-base">
            {team.teamName}
          </p>
          <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
            {team.ownerName} · {recordFor(team)}
          </p>
        </div>
        <div
          className={cn(
            'shrink-0 text-right sm:order-none sm:col-auto sm:row-auto sm:mt-0',
            finalized ? 'col-span-2 mt-2' : 'col-start-2 row-start-1',
          )}
        >
          <p
            className={cn(
              'font-mono font-bold tracking-tight',
              (finalized ? team.actualScore : team.projectedScore) == null
                ? 'text-xs'
                : 'text-xl sm:text-2xl',
            )}
          >
            {formatScore(
              finalized ? team.actualScore : team.projectedScore,
              finalized ? 2 : 1,
            )}
          </p>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground sm:text-xs sm:tracking-[0.12em]">
            {finalized ? 'Final score' : 'PPR estimate'}
          </p>
        </div>
      </div>
      <div className="mt-4" />
      {!locked ? (
        <Button
          variant={selected ? 'default' : 'outline'}
          size="sm"
          className="mt-auto min-h-11 w-full whitespace-normal px-2 py-2 text-xs sm:text-sm"
          aria-pressed={selected}
          aria-busy={pending}
          aria-label={`Pick ${team.teamName}${selected ? ', saved' : ''}`}
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
          {pending ? (
            'Saving…'
          ) : selected ? (
            'Saved pick'
          ) : (
            <>
              <span className="sm:hidden">Pick this team</span>
              <span className="hidden sm:inline">Pick {team.teamName}</span>
            </>
          )}
        </Button>
      ) : !signedIn ? (
        <p className="mt-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
          Sign in to reveal voters
        </p>
      ) : !votersReady ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Voter details unavailable until member data loads.
        </p>
      ) : (
        <div className="mt-3 border-t border-border pt-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold text-foreground/80">
              {voters.length} {voters.length === 1 ? 'vote' : 'votes'} ·{' '}
              {Math.round(votePercentage)}%
            </p>
            {selected && (
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-1 text-xs font-semibold text-primary">
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
                    'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium',
                    voter.isCurrentUser
                      ? 'bg-primary/[0.12] text-primary'
                      : 'bg-muted text-foreground/75',
                  )}
                >
                  {voter.name}
                  {voter.isCurrentUser && (
                    <span className="text-[11px] font-bold uppercase tracking-wide">
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
  pendingRoster,
  feedback,
  votersReady,
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
  pendingRoster: number | null;
  feedback?: { text: string; error: boolean };
  votersReady: boolean;
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
      <div className="flex items-center justify-between border-b border-border px-3.5 py-2.5 sm:px-4">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Matchup {index + 1}
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          {finalized
            ? 'Final'
            : locked
              ? user && votersReady
                ? `${totalVotes} ${totalVotes === 1 ? 'vote' : 'votes'}`
                : 'Locked'
              : databaseReady
                ? 'Picks open'
                : 'Picks unavailable'}
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
          disabled={
            !databaseReady ||
            matchup.databaseId == null ||
            pendingRoster != null
          }
          pending={pendingRoster === matchup.home.rosterId}
          votersReady={votersReady}
          onPick={pick}
        />
        <div className="flex items-center justify-center">
          <span className="font-mono text-xs font-black uppercase text-muted-foreground/50">
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
          disabled={
            !databaseReady ||
            matchup.databaseId == null ||
            pendingRoster != null
          }
          pending={pendingRoster === matchup.away.rosterId}
          votersReady={votersReady}
          onPick={pick}
        />
      </div>
      {feedback && (
        <p
          role={feedback.error ? 'alert' : 'status'}
          className={cn(
            'px-4 pb-3 text-sm leading-5',
            feedback.error ? 'text-destructive' : 'text-primary',
          )}
        >
          {feedback.text}
        </p>
      )}
      {locked && user && votersReady && totalVotes > 0 && (
        <div className="px-3.5 pb-3 sm:px-4">
          <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Community split</span>
            <span>
              {Math.round(homeVotePercentage)}% ·{' '}
              {Math.round(awayVotePercentage)}%
            </span>
          </div>
          <div
            className="flex h-1.5 overflow-hidden rounded-full bg-muted"
            aria-hidden="true"
          >
            <span
              className="h-full bg-primary transition-[width]"
              style={{ width: `${homeVotePercentage}%` }}
            />
            <span className="h-full flex-1 bg-accent/60" aria-hidden="true" />
          </div>
        </div>
      )}
      <Accordion className="border-t border-border px-3.5 sm:px-4">
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

export function PredictionCentre({
  data,
  mode = 'weekly',
}: {
  data: PredictionWeekData;
  mode?: PredictionView;
}) {
  const [locked, setLocked] = useState(data.locked);
  const member = usePredictionMember(data, locked);
  const {
    supabase,
    user,
    profile,
    votes,
    weeklyLeaderboard,
    seasonLeaderboard,
  } = member;
  const [loginOpen, setLoginOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');
  const [password, setPassword] = useState('');
  const [authPending, setAuthPending] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    error: boolean;
  } | null>(null);
  const [pending, setPending] = useState<Record<number, number>>({});
  const [feedback, setFeedback] = useState<
    Record<number, { text: string; error: boolean }>
  >({});
  const pendingIds = useRef(new Set<number>());
  const accountId = useRef<string | null>(null);
  const loginRef = useRef<HTMLDivElement>(null);
  const profileNames = new Map(
    member.names.map((item) => [item.id, item.display_name]),
  );
  const viewingStandings = mode === 'standings';
  const available = data.availability === 'ready' && data.databaseReady;
  const ownVotes = votes.filter((vote) => vote.voter_id === user?.id);
  const picksMade = new Set(ownVotes.map((vote) => vote.matchup_id)).size;

  useEffect(() => {
    accountId.current = user?.id ?? null;
  }, [user]);
  useEffect(() => {
    if (!data.lockAt) return;
    const tick = () =>
      setLocked(data.locked || Date.now() >= new Date(data.lockAt).getTime());
    const timer = window.setInterval(tick, 1000);
    window.addEventListener('focus', tick);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', tick);
    };
  }, [data.lockAt, data.locked]);

  const requireLogin = () => {
    setLoginOpen(true);
    loginRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
      block: 'start',
    });
    window.setTimeout(
      () => document.getElementById('pick-manager')?.focus(),
      0,
    );
  };

  const signIn = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || !selectedMember || !password || authPending) return;
    setMessage(null);
    if (!navigator.onLine) {
      setMessage({ text: signInErrorMessage({}, false), error: true });
      return;
    }
    setAuthPending(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: memberLoginEmail(selectedMember),
        password,
      });
      if (error) {
        setMessage({
          text: signInErrorMessage(error, navigator.onLine),
          error: true,
        });
        return;
      }
      setPassword('');
      setLoginOpen(false);
      setMessage({
        text: 'Signed in.',
        error: false,
      });
    } catch {
      setMessage({
        text: signInErrorMessage({}, navigator.onLine),
        error: true,
      });
    } finally {
      setAuthPending(false);
    }
  };

  const signOut = async () => {
    if (!supabase || pendingIds.current.size) return;
    setAuthPending(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setFeedback({});
      setMessage({ text: 'Signed out.', error: false });
    } catch {
      setMessage({
        text: 'Could not sign out. Please try again.',
        error: true,
      });
    } finally {
      setAuthPending(false);
    }
  };

  const castVote = async (
    matchup: PredictionMatchup,
    selectedRosterId: number,
  ) => {
    if (
      !supabase ||
      !user ||
      matchup.databaseId == null ||
      locked ||
      !available ||
      member.loading ||
      member.error
    )
      return;
    const id = matchup.databaseId;
    const voterId = user.id;
    if (pendingIds.current.has(id)) return;
    if (Date.now() >= new Date(data.lockAt).getTime()) {
      setLocked(true);
      return;
    }
    if (!navigator.onLine) {
      setFeedback((current) => ({
        ...current,
        [id]: {
          text: 'You’re offline. This change was not saved. Reconnect and pick again.',
          error: true,
        },
      }));
      return;
    }
    pendingIds.current.add(id);
    setPending((current) => ({ ...current, [id]: selectedRosterId }));
    setFeedback((current) => ({
      ...current,
      [id]: { text: 'Saving your pick…', error: false },
    }));
    try {
      const { saved, locked: serverLocked } = await persistPick(supabase, {
        matchup_id: id,
        voter_id: voterId,
        selected_roster_id: selectedRosterId,
      });
      if (accountId.current !== voterId) return;
      if (!saved) {
        const justLocked =
          Date.now() >= new Date(data.lockAt).getTime() || serverLocked;
        if (justLocked) setLocked(true);
        setFeedback((current) => ({
          ...current,
          [id]: {
            text: justLocked
              ? 'The Sunday deadline has passed. This change was not saved.'
              : 'We couldn’t confirm this change. Your last confirmed pick is shown. Retry or reload to check.',
            error: true,
          },
        }));
        return;
      }
      member.recordSavedVote(saved as VoteRecord);
      setFeedback((current) => ({
        ...current,
        [id]: {
          text: `Saved: ${selectedRosterId === matchup.home.rosterId ? matchup.home.teamName : matchup.away.teamName}. You can change it until Sunday’s deadline.`,
          error: false,
        },
      }));
    } catch {
      if (accountId.current === voterId)
        setFeedback((current) => ({
          ...current,
          [id]: {
            text: 'We couldn’t confirm this change. Reconnect and retry, or reload to check your saved pick.',
            error: true,
          },
        }));
    } finally {
      pendingIds.current.delete(id);
      setPending((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
    }
  };

  const memberEmpty = !user
    ? 'Sign in to see the prediction table.'
    : member.loading
      ? 'Loading your prediction standings…'
      : member.error
        ? 'Prediction standings are unavailable. Use Retry above.'
        : null;
  return (
    <div className="space-y-5">
      <div
        ref={loginRef}
        className="linear-panel scroll-mt-20 rounded-xl p-4 sm:p-5"
      >
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="flex gap-3">
            <span className="mt-0.5 text-primary">
              {viewingStandings ? (
                <Trophy className="size-5" />
              ) : locked ? (
                <LockKeyhole className="size-5" />
              ) : (
                <Vote className="size-5" />
              )}
            </span>
            <div>
              <h2 className="text-base font-semibold">
                {viewingStandings
                  ? 'The prediction title'
                  : !available
                    ? 'Weekly picks are not open'
                    : locked
                      ? data.finalized
                        ? 'Results settled'
                        : 'Picks locked. Calls on the record.'
                      : 'Make your calls'}
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                {viewingStandings ? (
                  'One point per correct winner. Missing a pick earns no point; tied games are excluded. Equal totals share a rank.'
                ) : data.lockAt ? (
                  <>
                    {locked ? 'Closed' : 'All six picks close'}{' '}
                    <time dateTime={data.lockAt}>
                      {formatLockTime(data.lockAt)}
                    </time>
                    .{' '}
                    {locked
                      ? 'Sign in to see the names behind the calls.'
                      : 'Earlier NFL games do not close voting. Other members can see your picks only after the Sunday deadline.'}
                  </>
                ) : (
                  'This week’s deadline is temporarily unavailable.'
                )}
              </p>
            </div>
          </div>
          {user ? (
            <div className="flex items-center justify-between gap-4 border-t border-border pt-3 lg:min-w-56 lg:border-0 lg:pt-0">
              <div>
                <p className="text-sm font-semibold">
                  {profile?.id === user.id
                    ? profile.display_name
                    : 'League member'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {member.loading
                    ? 'Checking saved picks…'
                    : member.error
                      ? 'Saved picks unavailable'
                      : viewingStandings
                        ? 'Member standings'
                        : available
                          ? `${picksMade} of ${data.matchups.length} picks saved`
                          : 'Waiting for this week’s ballot'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-11"
                onClick={signOut}
                disabled={authPending || Object.keys(pending).length > 0}
                aria-label="Sign out"
              >
                <LogOut />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="min-h-11"
              onClick={requireLogin}
              disabled={!supabase || member.loading}
            >
              {member.loading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <LogIn />
              )}{' '}
              {viewingStandings ? 'Sign in to view' : 'Sign in to make picks'}
            </Button>
          )}
        </div>
        {loginOpen && !user && (
          <form
            onSubmit={signIn}
            className="mt-5 grid items-end gap-3 border-t border-border pt-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
          >
            <div>
              <label
                htmlFor="pick-manager"
                className="mb-2 block text-xs font-medium"
              >
                Manager
              </label>
              <Select
                value={selectedMember}
                onValueChange={(value) => setSelectedMember(value ?? '')}
                items={leagueMembers.map((manager) => ({
                  value: manager.loginSlug,
                  label: manager.displayName,
                }))}
              >
                <SelectTrigger id="pick-manager" className="min-h-11 w-full">
                  <SelectValue placeholder="Choose your manager" />
                </SelectTrigger>
                <SelectContent>
                  {leagueMembers.map((manager) => (
                    <SelectItem
                      key={manager.loginSlug}
                      value={manager.loginSlug}
                    >
                      {manager.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                htmlFor="pick-password"
                className="mb-2 block text-xs font-medium"
              >
                Password
              </label>
              <Input
                id="pick-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                className="min-h-11"
                aria-describedby="sign-in-help"
              />
            </div>
            <Button
              type="submit"
              className="min-h-11 px-5"
              disabled={!selectedMember || !password || authPending}
            >
              {authPending && <LoaderCircle className="animate-spin" />}
              {authPending ? 'Signing in…' : 'Sign in'}
            </Button>
            <p
              id="sign-in-help"
              className="text-xs leading-5 text-muted-foreground sm:col-span-3"
            >
              Use the manager account and password supplied for MAC 12. Need
              access or a password reset? Ask the commissioner.
            </p>
          </form>
        )}
        {message && (
          <p
            role={message.error ? 'alert' : 'status'}
            className={cn(
              'mt-4 text-sm leading-6',
              message.error ? 'text-destructive' : 'text-muted-foreground',
            )}
          >
            {message.text}
          </p>
        )}
        {member.error && (
          <div className="mt-4">
            <p role="alert" className="text-sm text-destructive">
              {member.error}
            </p>
            {user && (
              <Button
                variant="outline"
                className="mt-3 min-h-11"
                onClick={member.refresh}
              >
                Retry
              </Button>
            )}
          </div>
        )}
        {!supabase && (
          <output className="mt-4 block text-sm text-muted-foreground">
            Member sign-in is temporarily unavailable. Please try again later.
          </output>
        )}
        {!viewingStandings && data.matchups.length > 0 && !available && (
          <output className="mt-4 text-sm leading-6 text-muted-foreground">
            The matchups are visible, but saving picks is not ready. Please try
            again after the next sync. Existing picks are not changed.
          </output>
        )}
      </div>
      {viewingStandings ? (
        <PredictionTable
          title={`${data.season} prediction standings`}
          subtitle="Every settled week counts toward the season title."
          rows={seasonLeaderboard}
          currentUserId={user?.id}
          emptyMessage={
            memberEmpty ??
            (!seasonLeaderboard.some((row) => row.completed_picks > 0)
              ? 'A clean slate. The standings begin when the first results are settled.'
              : undefined)
          }
        />
      ) : data.matchups.length ? (
        <div className="space-y-4">
          <p className="text-xs leading-5 text-muted-foreground">
            Pick fantasy matchup winners here. Lineups and PPR estimates are
            reference only; use Sleeper for league-scored projections and live
            scores.
          </p>
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
              databaseReady={available && !member.loading && !member.error}
              pendingRoster={
                matchup.databaseId == null
                  ? null
                  : (pending[matchup.databaseId] ?? null)
              }
              feedback={
                matchup.databaseId == null
                  ? undefined
                  : feedback[matchup.databaseId]
              }
              votersReady={!member.loading && !member.error}
              onPick={castVote}
              onRequireLogin={requireLogin}
            />
          ))}
        </div>
      ) : (
        <section className="linear-panel rounded-xl px-5 py-10">
          <ShieldCheck className="size-6 text-primary" />
          <h2 className="mt-4 text-xl font-bold">
            {data.availability === 'unavailable'
              ? 'This week is temporarily unavailable.'
              : 'The calls can wait. For now.'}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            {data.availability === 'unavailable'
              ? 'We couldn’t load the matchups. Saved picks have not been changed. Refresh to try again.'
              : 'Weekly picks open after Sleeper publishes the matchups and the daily sync prepares the ballot. No guesses about the fixtures.'}
          </p>
        </section>
      )}
      {!viewingStandings && (
        <PredictionTable
          title={`Week ${data.week} prediction table`}
          subtitle="One point per correct winner. Missing picks earn no point; tied games are excluded."
          rows={weeklyLeaderboard}
          currentUserId={user?.id}
          emptyMessage={
            memberEmpty ??
            (!data.finalized
              ? 'The table updates once final results are confirmed. No live scoring here—that’s Sleeper’s job.'
              : !weeklyLeaderboard.some((row) => row.completed_picks > 0)
                ? 'There are no decided matchups to count this week.'
                : undefined)
          }
        />
      )}
    </div>
  );
}
