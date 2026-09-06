'use client';

import { ArrowRight, Check, LockKeyhole } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { usePredictionMember } from './use-prediction-member';
import type { PredictionWeekData } from '@/lib/data/predictions';
import { formatLockTime } from '@/lib/predictions/rules';

export function ClubhousePicks({ data }: { data: PredictionWeekData }) {
  const [locked, setLocked] = useState(data.locked);
  const member = usePredictionMember(data, locked);
  useEffect(() => {
    const tick = () =>
      setLocked(data.locked || Date.now() >= new Date(data.lockAt).getTime());
    const timer = window.setInterval(tick, 1000);
    window.addEventListener('focus', tick);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', tick);
    };
  }, [data.lockAt, data.locked]);
  const ownVotes = member.votes.filter(
    (vote) => vote.voter_id === member.user?.id,
  );
  const picksMade = new Set(ownVotes.map((vote) => vote.matchup_id)).size;
  const available = data.availability === 'ready' && data.databaseReady;
  const complete = available && picksMade === data.matchups.length;
  const hasResults = member.seasonLeaderboard.some(
    (row) => row.completed_picks > 0,
  );

  return (
    <div className="clubhouse-picks-grid">
      <section className="pick-spotlight" aria-labelledby="weekly-picks-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="ui-kicker text-primary">
            Weekly picks {data.season && ` / Week ${data.week}`}
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
        <h2 id="weekly-picks-title" className="clubhouse-headline mt-6">
          {data.finalized
            ? 'The calls are in.\nSo are the receipts.'
            : locked && available
              ? 'You made your calls.\nOwn them.'
              : 'Everyone’s an expert.\nPut it on record.'}
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
          {data.availability === 'unavailable'
            ? 'We can’t load this week’s picks right now. Saved picks are not changed. Try again shortly.'
            : !available
              ? 'Weekly picks open once the matchups are published and prepared. Six fantasy matchups. One prediction title to argue about.'
              : locked
                ? 'The ballot is closed. Members can see who backed whom; the prediction table updates after results are settled.'
                : 'Pick the winner of each fantasy matchup. Your calls stay private until Sunday, then the whole league gets to see them.'}
        </p>
        <div className="mt-6 border-t border-border pt-4">
          {data.lockAt && (
            <p className="text-xs leading-5 text-muted-foreground">
              {locked ? 'Closed' : 'Deadline'}:{' '}
              <time dateTime={data.lockAt}>{formatLockTime(data.lockAt)}</time>
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <a
              href="/matchups"
              className={buttonVariants({ className: 'min-h-11 px-5' })}
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
                  <Check className="size-4" /> {picksMade} of{' '}
                  {data.matchups.length} saved
                </span>
              ))}
          </div>
        </div>
      </section>
      <section
        className="prediction-race"
        aria-labelledby="prediction-race-title"
      >
        <p className="ui-kicker">The other title</p>
        <h2
          id="prediction-race-title"
          className="mt-2 text-2xl font-bold tracking-tight"
        >
          Who calls it best?
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The season-long prediction race. One point for every correct winner.
        </p>
        <div className="my-5 flex-1 border-y border-border py-5">
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
                For league members. Sign in through Weekly picks to see the
                table.
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
                <li
                  key={row.voter_id}
                  className="flex items-start gap-3 text-sm"
                >
                  <span className="w-5 font-mono text-muted-foreground">
                    {member.seasonLeaderboard.findIndex(
                      (candidate) =>
                        candidate.correct_picks === row.correct_picks &&
                        Number(candidate.accuracy) === Number(row.accuracy),
                    ) + 1}
                  </span>
                  <span className="min-w-0 flex-1 font-medium">
                    {row.display_name}
                    {row.voter_id === member.user?.id && (
                      <span className="ml-1 text-xs text-primary">(you)</span>
                    )}
                  </span>
                  <span className="font-mono text-primary">
                    {row.correct_picks}
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
    </div>
  );
}
