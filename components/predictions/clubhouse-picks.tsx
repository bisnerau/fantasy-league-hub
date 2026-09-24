'use client';

import { ArrowRight, Check, LockKeyhole, Timer } from 'lucide-react';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { DriveTracker } from '@/components/clubhouse/drive-tracker';
import { FlapCountdown } from '@/components/clubhouse/flap-countdown';
import { DecryptedText } from '@/components/effects/decrypted-text';
import { Button, buttonVariants } from '@/components/ui/button';
import { usePredictionMember } from './use-prediction-member';
import type { PredictionWeekData } from '@/lib/data/predictions';
import { getRemaining, isTwoMinuteWarning } from '@/lib/countdown';
import { formatLockTime } from '@/lib/predictions/rules';
import { cn } from '@/lib/utils';

type Clubhouse = {
  data: PredictionWeekData;
  locked: boolean;
  now: number | null;
  member: ReturnType<typeof usePredictionMember>;
};

const ClubhouseContext = createContext<Clubhouse | null>(null);

function useClubhouse() {
  const clubhouse = useContext(ClubhouseContext);
  if (!clubhouse) throw new Error('Clubhouse components need the provider');
  return clubhouse;
}

/** One member read shared by the hero and the prediction race. */
export function ClubhouseMemberProvider({
  data,
  children,
}: {
  data: PredictionWeekData;
  children: ReactNode;
}) {
  const [locked, setLocked] = useState(data.locked);
  const [now, setNow] = useState<number | null>(null);
  const member = usePredictionMember(data, locked);
  useEffect(() => {
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
  return (
    <ClubhouseContext.Provider value={{ data, locked, now, member }}>
      {children}
    </ClubhouseContext.Provider>
  );
}

export type HeroFeature = {
  databaseId: number | null;
  home: { rosterId: number; ownerName: string };
  away: { rosterId: number; ownerName: string };
};

function leagueSplit(
  feature: HeroFeature,
  votes: { matchup_id: number; selected_roster_id: number }[],
) {
  const calls = votes.filter((vote) => vote.matchup_id === feature.databaseId);
  const home = calls.filter(
    (vote) => vote.selected_roster_id === feature.home.rosterId,
  ).length;
  const away = calls.length - home;
  if (!calls.length) return 'No calls on record for the Match of the Week.';
  if (home === away)
    return `Match of the Week: the league is split ${home}–${away}.`;
  const leader = home > away ? feature.home : feature.away;
  return `Match of the Week: the league backs ${leader.ownerName} ${Math.max(home, away)}–${Math.min(home, away)}.`;
}

export function PicksHero({ feature }: { feature: HeroFeature | null }) {
  const { data, locked, now, member } = useClubhouse();
  const ownVotes = member.votes.filter(
    (vote) => vote.voter_id === member.user?.id,
  );
  const picksMade = new Set(ownVotes.map((vote) => vote.matchup_id)).size;
  const available = data.availability === 'ready' && data.databaseReady;
  const complete = available && picksMade === data.matchups.length;
  const hasBanker = member.bankers.some((b) => b.voter_id === member.user?.id);
  const memberReady = Boolean(member.user) && !member.loading && !member.error;
  const warning =
    available &&
    !locked &&
    now != null &&
    isTwoMinuteWarning(data.lockAt, now) &&
    !(memberReady && complete);

  return (
    <section
      className={cn('pick-spotlight', warning && 'warning-border')}
      aria-labelledby="weekly-picks-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="ui-kicker text-primary">
          MAC 12 {data.season && ` · ${data.season}`}
        </p>
        <span className="text-xs text-muted-foreground">
          {data.finalized
            ? 'Results settled'
            : data.availability === 'unavailable'
              ? 'Temporarily unavailable'
              : !available
                ? 'Not open yet'
                : locked
                  ? 'Picks locked'
                  : 'Open for calls'}
        </span>
      </div>
      <h1
        id="weekly-picks-title"
        className="mt-2 font-heading text-5xl font-black leading-none tracking-[-0.06em] sm:text-7xl"
      >
        {data.season ? `Week ${data.week}` : 'Weekly picks'}
      </h1>
      {warning && (
        <p className="warning-label mt-3">
          <Timer className="size-4" aria-hidden="true" /> Two-minute warning
        </p>
      )}
      <div className="mt-4">
        {data.availability === 'unavailable' ? (
          <p className="text-sm leading-6 text-muted-foreground">
            We can’t load this week’s picks right now. Saved picks are not
            changed.
          </p>
        ) : !available ? (
          <p className="text-sm leading-6 text-muted-foreground">
            Picks open once the matchups are published.
          </p>
        ) : !locked ? (
          <>
            <p className="ui-kicker">Picks close in</p>
            <div className="mt-2">
              <FlapCountdown
                remaining={
                  now == null
                    ? null
                    : getRemaining(Date.parse(data.lockAt), now)
                }
                until="until picks close"
              />
            </div>
          </>
        ) : (
          <div>
            <p className="text-xl font-bold tracking-tight">
              {data.finalized ? 'The results are in.' : 'The ballot is closed.'}
            </p>
            {feature &&
              (!member.user ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  Sign in to see how the league voted.
                </p>
              ) : (
                memberReady && (
                  <p className="mt-1 text-sm font-semibold text-primary">
                    <DecryptedText text={leagueSplit(feature, member.votes)} />
                  </p>
                )
              ))}
          </div>
        )}
        {data.lockAt && (
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            {locked ? 'Closed' : 'Deadline'}:{' '}
            <time dateTime={data.lockAt}>{formatLockTime(data.lockAt)}</time>
          </p>
        )}
      </div>
      {available && (
        <DriveTracker
          picks={memberReady ? picksMade : 0}
          total={data.matchups.length}
          banker={memberReady && hasBanker}
        />
      )}
      <div className="mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
        <a
          href="/matchups"
          className={buttonVariants({
            className: 'min-h-12 w-full px-5 text-base sm:w-auto',
          })}
        >
          {!available
            ? 'Visit weekly picks'
            : locked
              ? 'See the picks'
              : member.user
                ? complete
                  ? 'Review your picks'
                  : 'Make your picks'
                : 'Sign in to make picks'}{' '}
          <ArrowRight />
        </a>
        {member.user &&
          available &&
          (member.loading ? (
            <span className="text-xs text-muted-foreground">
              Checking saved picks…
            </span>
          ) : member.error ? (
            <span className="text-xs text-destructive">
              Saved-pick count unavailable
            </span>
          ) : (
            <span className="flex items-center gap-2 text-sm text-primary">
              <Check className="size-4" /> {picksMade} of {data.matchups.length}{' '}
              saved ·{' '}
              {hasBanker
                ? 'Banker saved'
                : locked
                  ? 'No Banker'
                  : 'Choose your Banker'}
            </span>
          ))}
      </div>
    </section>
  );
}

export function PredictionRace() {
  const { member } = useClubhouse();
  const hasResults = member.seasonLeaderboard.some(
    (row) => row.completed_picks > 0,
  );
  return (
    <section
      className="prediction-race"
      aria-labelledby="prediction-race-title"
    >
      <p className="ui-kicker">The other title</p>
      <h2
        id="prediction-race-title"
        className="mt-1 text-xl font-bold tracking-tight"
      >
        Who calls it best?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        One point per correct winner. Two for a correct Banker.
      </p>
      <div className="my-4 flex-1 border-y border-border py-4">
        {member.loading ? (
          <div
            aria-live="polite"
            aria-label="Loading prediction standings"
            className="space-y-3"
          >
            <div className="skeleton-shimmer h-5 w-4/5" />
            <div className="skeleton-shimmer h-5 w-3/5" />
            <div className="skeleton-shimmer h-5 w-4/5" />
          </div>
        ) : !member.user ? (
          <div className="flex gap-3 text-sm leading-6 text-muted-foreground">
            <LockKeyhole className="mt-1 size-4 shrink-0" />
            <p>
              For league members. Sign in through Weekly picks to see the table.
            </p>
          </div>
        ) : member.error ? (
          <div>
            <p role="alert" className="text-sm text-destructive">
              {member.error}
            </p>
            <Button
              variant="outline"
              className="mt-3 min-h-11"
              onClick={member.refresh}
            >
              Retry
            </Button>
          </div>
        ) : !hasResults ? (
          <p className="text-sm leading-6 text-muted-foreground">
            A clean slate. The first settled results will put names on the
            board.
          </p>
        ) : (
          <ol className="space-y-4">
            {member.seasonLeaderboard.slice(0, 3).map((row) => (
              <li key={row.voter_id} className="flex items-start gap-3 text-sm">
                <span className="w-5 font-mono text-muted-foreground">
                  {member.seasonLeaderboard.findIndex(
                    (candidate) => candidate.points === row.points,
                  ) + 1}
                </span>
                <span className="min-w-0 flex-1 font-medium">
                  {row.display_name}
                  {row.voter_id === member.user?.id && (
                    <span className="ml-1 text-xs text-primary">(you)</span>
                  )}
                </span>
                <span className="font-mono text-primary">
                  {row.points}
                  <span className="ml-1 text-xs text-muted-foreground">
                    pts
                  </span>
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
      <a href="/matchups?view=standings" className="clubhouse-text-link">
        Full prediction table <ArrowRight className="size-4" />
      </a>
    </section>
  );
}
