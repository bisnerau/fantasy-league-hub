'use client';

import {
  useEffect,
  useState,
  useRef,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import { LoaderCircle, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { usePredictionMember, type VoteRecord } from './use-prediction-member';
import { signInErrorMessage } from '@/lib/predictions/rules';
import { persistPick, persistBanker } from '@/lib/predictions/votes';
import { getSlip } from '@/lib/predictions/slip';
import { spark } from '@/components/effects/click-spark';
import { prefersReducedMotion } from '@/lib/motion';
import { Button } from '@/components/ui/button';
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
  PredictionWeekData,
} from '@/lib/data/predictions';
import type { MatchOfTheWeek } from '@/lib/data/match-of-the-week';
import type { Rivalry } from '@/lib/data/rivalries';
import { cn } from '@/lib/utils';
import { BetSlip, type SlipState } from './bet-slip';
import { MatchupCard } from './matchup-card';
import { PicksHero } from './picks-hero';
import { PredictionPodium } from './prediction-podium';
import { QuickPick } from './quick-pick';
import { SeasonTimeline } from './season-timeline';

type PredictionView = 'weekly' | 'standings';

/** Fire the celebration from a card's half, only after a verified save. */
function sparkHalf(
  sleeperMatchupId: number,
  side: 'home' | 'away',
  gold: boolean,
) {
  spark(
    document.querySelector(
      `#matchup-${sleeperMatchupId} [data-side="${side}"]`,
    ),
    { gold },
  );
}

export function PredictionCentre({
  data,
  mode = 'weekly',
  matchOfTheWeek,
  rivalries = {},
  tabs,
}: {
  data: PredictionWeekData;
  mode?: PredictionView;
  matchOfTheWeek?: MatchOfTheWeek | null;
  rivalries?: Record<number, Rivalry>;
  tabs?: ReactNode;
}) {
  const [locked, setLocked] = useState(data.locked);
  const [now, setNow] = useState<number | null>(null);
  // Set only after a verified save; the effect below fires the spark.
  const [celebration, setCelebration] = useState<{
    sleeperMatchupId: number;
    side: 'home' | 'away';
    gold: boolean;
    slip: boolean;
  } | null>(null);
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
  const bankerSaving = useRef(false);
  const [bankerPending, setBankerPending] = useState(false);
  const accountId = useRef<string | null>(null);
  const loginRef = useRef<HTMLDivElement>(null);
  const profileNames = new Map(
    member.names.map((item) => [item.id, item.display_name]),
  );
  const viewingStandings = mode === 'standings';
  const available = data.availability === 'ready' && data.databaseReady;
  const ownVotes = votes.filter((vote) => vote.voter_id === user?.id);
  const picksMade = new Set(ownVotes.map((vote) => vote.matchup_id)).size;

  // Handlers read the latest saved picks without depending on render values.
  const ownVotesRef = useRef(ownVotes);
  useEffect(() => {
    ownVotesRef.current = ownVotes;
  });
  useEffect(() => {
    accountId.current = user?.id ?? null;
  }, [user]);
  useEffect(() => {
    if (!celebration) return;
    sparkHalf(celebration.sleeperMatchupId, celebration.side, celebration.gold);
    if (celebration.slip)
      spark(document.querySelector('.bet-slip-bar'), { gold: true });
  }, [celebration]);
  useEffect(() => {
    if (!data.lockAt) return;
    const tick = () => {
      const time = Date.now();
      setNow(time);
      setLocked(data.locked || time >= new Date(data.lockAt).getTime());
    };
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);
    window.addEventListener('focus', tick);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
      window.removeEventListener('focus', tick);
    };
  }, [data.lockAt, data.locked]);

  const requireLogin = () => {
    setLoginOpen(true);
    loginRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'instant' : 'smooth',
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
    if (!supabase || pendingIds.current.size || bankerSaving.current) return;
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
      member.error ||
      bankerSaving.current
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
    const side = selectedRosterId === matchup.home.rosterId ? 'home' : 'away';
    const gold = member.bankers.some(
      (b) => b.voter_id === voterId && b.matchup_id === id,
    );
    const saved = ownVotesRef.current;
    const completesSlip =
      !saved.some((vote) => vote.matchup_id === id) &&
      new Set(saved.map((vote) => vote.matchup_id)).size + 1 ===
        data.matchups.length;
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
      setCelebration({
        sleeperMatchupId: matchup.sleeperMatchupId,
        side,
        gold,
        slip: completesSlip,
      });
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

  const chooseBanker = async (matchup: PredictionMatchup) => {
    if (
      !supabase ||
      !user ||
      !available ||
      locked ||
      member.loading ||
      member.error ||
      bankerSaving.current ||
      pendingIds.current.size ||
      matchup.databaseId == null ||
      !ownVotes.some((v) => v.matchup_id === matchup.databaseId)
    )
      return;
    if (Date.now() >= new Date(data.lockAt).getTime()) {
      setLocked(true);
      return;
    }
    const voterId = user.id;
    const id = matchup.databaseId;
    if (!navigator.onLine) {
      setFeedback((current) => ({
        ...current,
        [id]: {
          text: 'You’re offline. Your Banker was not changed.',
          error: true,
        },
      }));
      return;
    }
    const banked = ownVotesRef.current.find((vote) => vote.matchup_id === id);
    const bankedSide = !banked
      ? null
      : banked.selected_roster_id === matchup.home.rosterId
        ? 'home'
        : 'away';
    bankerSaving.current = true;
    setBankerPending(true);
    try {
      const { saved, locked: serverLocked } = await persistBanker(
        supabase,
        id,
        voterId,
      );
      if (accountId.current !== voterId) return;
      if (!saved) {
        if (serverLocked || Date.now() >= new Date(data.lockAt).getTime())
          setLocked(true);
        throw new Error('Unconfirmed Banker');
      }
      member.recordSavedBanker(saved);
      if (bankedSide)
        setCelebration({
          sleeperMatchupId: matchup.sleeperMatchupId,
          side: bankedSide,
          gold: true,
          slip: false,
        });
      setFeedback((current) => ({
        ...current,
        [id]: {
          text: 'Banker saved. This replaces any previous Banker for the week. Correct: 2 points. Wrong or tied: 0.',
          error: false,
        },
      }));
    } catch {
      if (accountId.current === voterId)
        setFeedback((current) => ({
          ...current,
          [id]: {
            text:
              Date.now() >= new Date(data.lockAt).getTime()
                ? 'The Sunday deadline has passed. Reload to check your locked Banker.'
                : 'We couldn’t confirm your Banker. Your last confirmed choice is shown. Retry or reload to check.',
            error: true,
          },
        }));
    } finally {
      bankerSaving.current = false;
      setBankerPending(false);
    }
  };

  const memberEmpty = !user
    ? 'Sign in to see the prediction table.'
    : member.loading
      ? 'Loading your prediction standings…'
      : member.error
        ? 'Prediction standings are unavailable. Use Retry above.'
        : null;
  const memberReady = Boolean(user) && !member.loading && !member.error;
  const hasBanker = member.bankers.some((b) => b.voter_id === user?.id);
  const featured = data.matchups.find(
    (matchup) => matchup.sleeperMatchupId === matchOfTheWeek?.sleeperMatchupId,
  );
  const slip = getSlip(data.matchups, votes, member.bankers, user?.id);
  const showSlip = !viewingStandings && available && data.matchups.length > 0;
  const slipState: SlipState = !user
    ? 'signed-out'
    : member.loading
      ? 'loading'
      : member.error
        ? 'unavailable'
        : data.finalized
          ? 'settled'
          : locked
            ? 'locked'
            : 'open';
  const databaseReady =
    available && !member.loading && !member.error && !bankerPending;
  const jumpTo = (sleeperMatchupId: number) => {
    const card = document.getElementById(`matchup-${sleeperMatchupId}`);
    if (!card) return;
    card.scrollIntoView({
      behavior: prefersReducedMotion() ? 'instant' : 'smooth',
      block: 'center',
    });
    card
      .querySelector<HTMLButtonElement>('.faceoff-pick:not(:disabled)')
      ?.focus({ preventScroll: true });
  };

  return (
    <div className={cn('space-y-5', showSlip && 'picks-with-slip')}>
      <PicksHero
        data={data}
        locked={locked}
        now={now}
        standings={viewingStandings}
        available={available}
        feature={featured ?? null}
        votes={votes}
        signedIn={Boolean(user)}
        memberReady={memberReady}
        picksMade={picksMade}
        hasBanker={hasBanker}
        actions={
          // Stays mounted through the member refresh that follows each save.
          user &&
          !member.error &&
          !locked && (
            <QuickPick
              matchups={data.matchups}
              pickedIds={new Set(ownVotes.map((vote) => vote.matchup_id))}
              pending={pending}
              feedback={feedback}
              disabled={!databaseReady}
              onPick={castVote}
            />
          )
        }
      >
        <div
          ref={loginRef}
          className="mt-5 scroll-mt-20 border-t border-border pt-4"
        >
          {user ? (
            <div className="flex items-center justify-between gap-4">
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
                disabled={
                  authPending ||
                  bankerPending ||
                  Object.keys(pending).length > 0
                }
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
            <output className="mt-4 block text-sm leading-6 text-muted-foreground">
              The matchups are visible, but saving picks is not ready. Please
              try again after the next sync. Existing picks are not changed.
            </output>
          )}
        </div>
      </PicksHero>
      {tabs}
      {!viewingStandings && (
        <SeasonTimeline
          week={data.week}
          currentWeek={data.currentWeek}
          locked={locked}
          finalized={data.finalized}
          memberWeeks={member.myWeeks}
        />
      )}
      {viewingStandings ? (
        <PredictionPodium
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
          {data.matchups.map((matchup) => (
            <MatchupCard
              key={matchup.sleeperMatchupId}
              matchup={matchup}
              lockAt={data.lockAt}
              feature={
                matchup.sleeperMatchupId === matchOfTheWeek?.sleeperMatchupId
                  ? matchOfTheWeek
                  : undefined
              }
              locked={locked}
              finalized={data.finalized}
              user={user}
              votes={votes}
              profileNames={profileNames}
              databaseReady={databaseReady}
              rivalry={rivalries[matchup.sleeperMatchupId]}
              bankers={member.bankers}
              bankerPending={bankerPending}
              savingPick={Object.keys(pending).length > 0}
              onBanker={chooseBanker}
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
        <PredictionPodium
          title={`Week ${data.week} prediction table`}
          subtitle="Correct pick: 1 point. Correct Banker: 2 points total. Bankers shows correct / settled; ties are excluded."
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
      {showSlip && (
        <BetSlip
          slip={slip}
          matchups={data.matchups}
          state={slipState}
          week={data.week}
          weeklyRows={weeklyLeaderboard}
          userId={user?.id}
          onJump={jumpTo}
          onSignIn={requireLogin}
        />
      )}
    </div>
  );
}
