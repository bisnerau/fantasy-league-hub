'use client';

import type { ReactNode } from 'react';
import { Info, LockKeyhole, Star, Timer, Trophy, Vote } from 'lucide-react';
import { DriveTracker } from '@/components/clubhouse/drive-tracker';
import { FlapCountdown } from '@/components/clubhouse/flap-countdown';
import { DecryptedText } from '@/components/effects/decrypted-text';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { PredictionWeekData } from '@/lib/data/predictions';
import { getRemaining, isTwoMinuteWarning } from '@/lib/countdown';
import { formatLockTime } from '@/lib/predictions/rules';
import type { VoteRecord } from '@/lib/predictions/votes';
import { cn } from '@/lib/utils';
import { leagueSplit, type HeroFeature } from './clubhouse-picks';

/** The Weekly Picks scoreboard: the same stadium board as the homepage. */
export function PicksHero({
  data,
  locked,
  now,
  standings,
  available,
  feature,
  votes,
  signedIn,
  memberReady,
  picksMade,
  hasBanker,
  children,
  actions,
}: {
  data: PredictionWeekData;
  locked: boolean;
  now: number | null;
  standings: boolean;
  available: boolean;
  feature: HeroFeature | null;
  votes: VoteRecord[];
  signedIn: boolean;
  memberReady: boolean;
  picksMade: number;
  hasBanker: boolean;
  children: ReactNode;
  actions?: ReactNode;
}) {
  const complete = picksMade === data.matchups.length;
  const warning =
    !standings &&
    available &&
    !locked &&
    now != null &&
    isTwoMinuteWarning(data.lockAt, now) &&
    !(memberReady && complete);
  const status = standings
    ? 'The prediction title'
    : !available
      ? 'Weekly picks are not open'
      : locked
        ? data.finalized
          ? 'Results settled'
          : 'Picks locked. Calls on the record.'
        : 'Make your calls';

  return (
    <section
      className={cn('pick-spotlight picks-hero', warning && 'warning-border')}
      aria-labelledby="picks-title"
    >
      <p className="ui-kicker text-primary">
        Weekly picks{data.season && ` · ${data.season}`}
      </p>
      <h1
        id="picks-title"
        className="week-title mt-2 font-heading text-5xl font-black leading-none tracking-[-0.06em] sm:text-6xl"
      >
        {standings
          ? 'Who calls it best?'
          : data.season
            ? `Week ${data.week}`
            : 'Weekly picks'}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-primary" aria-hidden="true">
          {standings ? (
            <Trophy className="size-4" />
          ) : locked ? (
            <LockKeyhole className="size-4" />
          ) : (
            <Vote className="size-4" />
          )}
        </span>
        <h2 className="text-base font-semibold">{status}</h2>
        {warning && (
          <p className="warning-label">
            <Timer className="size-4" aria-hidden="true" /> Two-minute warning
          </p>
        )}
      </div>
      {standings ? (
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          One point per correct winner; two for your weekly Banker. Wrong or
          missing picks earn zero; ties are excluded. Equal points share a rank.
        </p>
      ) : (
        <div className="mt-4">
          {available && !locked ? (
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
          ) : available && locked ? (
            <div>
              <p className="text-xl font-bold tracking-tight">
                {data.finalized
                  ? 'The results are in.'
                  : 'The ballot is closed.'}
              </p>
              {feature &&
                (!signedIn ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Sign in to see how the league voted.
                  </p>
                ) : (
                  memberReady && (
                    <p className="mt-1 text-sm font-semibold text-primary">
                      <DecryptedText text={leagueSplit(feature, votes)} />
                    </p>
                  )
                ))}
            </div>
          ) : null}
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            {data.lockAt ? (
              <>
                {locked ? 'Closed' : 'Deadline'}:{' '}
                <time dateTime={data.lockAt}>
                  {formatLockTime(data.lockAt)}
                </time>
                .{' '}
                {locked
                  ? 'Sign in to see the names behind the calls.'
                  : 'Your picks stay private until then.'}
              </>
            ) : (
              'This week’s deadline is temporarily unavailable.'
            )}
          </p>
          {available && (
            <DriveTracker
              picks={memberReady ? picksMade : 0}
              total={data.matchups.length}
              banker={memberReady && hasBanker}
            />
          )}
          {available && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <p className="banker-line">
                <Star className="size-4 text-award" aria-hidden="true" />
                Banker ×2 · hold a pick to bank it
              </p>
              <Popover>
                <PopoverTrigger
                  className="banker-info"
                  aria-label="How the Banker works"
                >
                  <Info className="size-4" aria-hidden="true" />
                </PopoverTrigger>
                <PopoverContent className="w-72 text-sm leading-6">
                  <p>
                    Save a winner, then hold it to make it your Banker. A
                    correct Banker earns 2 points total; other correct picks
                    earn 1. Wrong or tied: 0. Maximum 7 points from six games.
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    Your Banker stays private and locks with your picks.
                    Choosing another replaces it; change the winner in your
                    Banker matchup and the Banker follows your new pick.
                  </p>
                </PopoverContent>
              </Popover>
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
