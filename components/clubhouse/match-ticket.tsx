import { ArrowRight, Star } from 'lucide-react';
import { TearReveal } from '@/components/effects/tear-reveal';
import { ChalkPlay } from '@/components/clubhouse/chalk-play';
import type { MatchOfTheWeek } from '@/lib/data/match-of-the-week';
import type { PredictionMatchup } from '@/lib/data/predictions';
import { formatIrishTime } from '@/lib/format/irish-time';

function getCall(matchup: PredictionMatchup) {
  const { home, away, preview } = matchup;
  if (preview && [home.rosterId, away.rosterId].includes(preview.pickRosterId))
    return {
      side: preview.pickRosterId === home.rosterId ? 'home' : 'away',
      label: 'Our call',
    } as const;
  if (
    home.projectedScore != null &&
    away.projectedScore != null &&
    home.projectedScore !== away.projectedScore
  )
    return {
      side: home.projectedScore > away.projectedScore ? 'home' : 'away',
      label: 'Projected',
    } as const;
  return null;
}

/** This week's Match of the Week as a game-day ticket you tear to open. */
export function MatchTicket({
  matchup,
  selection,
  week,
  lockAt,
}: {
  matchup: PredictionMatchup;
  selection: MatchOfTheWeek;
  week: number;
  lockAt: string;
}) {
  const href = `/matchups?week=${week}#matchup-${matchup.sleeperMatchupId}`;
  const lock = Date.parse(lockAt);
  return (
    <section aria-labelledby="ticket-title">
      <h2 id="ticket-title" className="sr-only">
        Match of the Week: {matchup.home.teamName} v {matchup.away.teamName}
      </h2>
      <TearReveal
        variant="ticket"
        cover={
          <span className="ticket-stub">
            <span className="ticket-main">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-award">
                <Star className="size-3.5" aria-hidden="true" /> Match of the
                Week
              </span>
              <span className="ticket-teams">
                {matchup.home.teamName}
                <span className="ticket-versus">v</span>
                {matchup.away.teamName}
              </span>
              <span className="truncate text-xs font-medium text-muted-foreground">
                {matchup.home.ownerName} v {matchup.away.ownerName}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {Number.isFinite(lock)
                  ? `Picks close ${formatIrishTime(lock, { weekday: 'short', time: true })}`
                  : `Week ${week}`}{' '}
                · Tear to open →
              </span>
            </span>
            <span className="ticket-side" aria-hidden="true">
              <span>Admit</span>
              <span>One</span>
              <span className="ticket-week">Wk {week}</span>
            </span>
          </span>
        }
      >
        <div className="ticket-open">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-award">
            <Star className="size-3.5" aria-hidden="true" /> Match of the Week ·
            Week {week}
          </p>
          <ChalkPlay
            home={matchup.home.ownerName.split(' ')[0]}
            away={matchup.away.ownerName.split(' ')[0]}
            call={getCall(matchup)}
          />
          {matchup.preview && (
            <p className="text-lg font-bold leading-snug tracking-tight">
              {matchup.preview.headline}
            </p>
          )}
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {selection.reason}
          </p>
          <a href={href} className="clubhouse-text-link mt-2 min-h-11">
            {matchup.preview ? 'Read the preview' : 'See the matchup'}{' '}
            <ArrowRight className="size-4" />
          </a>
        </div>
      </TearReveal>
    </section>
  );
}
