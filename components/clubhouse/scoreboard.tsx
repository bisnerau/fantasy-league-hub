import { ArrowRight, RotateCw, Star } from 'lucide-react';
import { FlipCard } from '@/components/effects/flip-card';
import { TeamAvatar } from '@/components/shared/team-avatar';
import {
  orderMatchupsForDisplay,
  type MatchOfTheWeek,
} from '@/lib/data/match-of-the-week';
import type {
  PredictionMatchup,
  PredictionTeam,
  PredictionWeekData,
} from '@/lib/data/predictions';
import { formatScore } from '@/lib/sleeper/scores';
import { cn } from '@/lib/utils';

function winnerOf(matchup: PredictionMatchup) {
  const { home, away } = matchup;
  if (home.actualScore == null || away.actualScore == null) return null;
  if (home.actualScore === away.actualScore) return null;
  return home.actualScore > away.actualScore ? home : away;
}

function TeamRow({
  team,
  value,
  winner,
}: {
  team: PredictionTeam;
  value: string;
  winner: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5',
        winner ? 'text-foreground' : 'text-muted-foreground',
      )}
    >
      <TeamAvatar
        avatar={team.avatar}
        name={team.teamName}
        className="size-8"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">
          {team.teamName}
        </span>
        <span className="block truncate text-[11px] text-muted-foreground">
          {team.ownerName}
        </span>
      </span>
      <span
        className={cn(
          'score-number text-xl',
          winner ? 'text-primary' : 'text-muted-foreground',
        )}
      >
        {value}
      </span>
    </div>
  );
}

function CardHeading({
  matchup,
  featured,
  status,
}: {
  matchup: PredictionMatchup;
  featured: boolean;
  status: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
      {featured ? (
        <span className="inline-flex items-center gap-1 text-primary">
          <Star className="size-3.5" aria-hidden="true" /> Match of the Week
        </span>
      ) : (
        <span className="text-muted-foreground">
          Matchup {matchup.sleeperMatchupId}
        </span>
      )}
      <span className="text-muted-foreground">{status}</span>
    </div>
  );
}

export function Scoreboard({
  data,
  feature,
}: {
  data: PredictionWeekData;
  feature: MatchOfTheWeek | null;
}) {
  const settled = data.finalized;
  const matchups = orderMatchupsForDisplay(data.matchups, feature);
  if (!matchups.length) return null;
  const href = (matchup: PredictionMatchup) =>
    `/matchups?week=${data.week}#matchup-${matchup.sleeperMatchupId}`;

  return (
    <section aria-labelledby="scoreboard-title">
      <div className="section-heading">
        <div>
          <p className="ui-kicker text-primary">
            {settled ? 'Final scores' : 'Projected'}
          </p>
          <h2 id="scoreboard-title" className="section-title">
            Week {data.week} {settled ? 'results' : 'fixtures'}
          </h2>
        </div>
        <a
          href={`/matchups?week=${data.week}`}
          className="clubhouse-text-link min-h-11"
        >
          All matchups <ArrowRight className="size-4" />
        </a>
      </div>
      <ul className="snap-rail scoreboard-rail">
        {matchups.map((matchup) => {
          const featured =
            feature?.sleeperMatchupId === matchup.sleeperMatchupId;
          const title = `${matchup.home.teamName} v ${matchup.away.teamName}`;
          if (!settled)
            return (
              <li key={matchup.sleeperMatchupId}>
                <a
                  href={href(matchup)}
                  className={cn(
                    'score-card block',
                    featured && 'spotlight-card score-card-featured',
                  )}
                >
                  <CardHeading
                    matchup={matchup}
                    featured={featured}
                    status="Projected"
                  />
                  <div className="space-y-2.5">
                    {[matchup.home, matchup.away].map((team) => (
                      <TeamRow
                        key={team.rosterId}
                        team={team}
                        value={formatScore(team.projectedScore, 1)}
                        winner={false}
                      />
                    ))}
                  </div>
                  <span className="sr-only">{title}</span>
                </a>
              </li>
            );
          const winner = winnerOf(matchup);
          const margin =
            winner &&
            Math.abs(matchup.home.actualScore! - matchup.away.actualScore!);
          return (
            <li key={matchup.sleeperMatchupId}>
              <FlipCard
                spotlight={featured}
                className={cn(featured && 'score-card-featured')}
                flipLabel={`Show the round-up for ${title}`}
                front={
                  <div className="score-card flex flex-col">
                    <CardHeading
                      matchup={matchup}
                      featured={featured}
                      status="Final"
                    />
                    <div className="space-y-2.5">
                      {[matchup.home, matchup.away].map((team) => (
                        <TeamRow
                          key={team.rosterId}
                          team={team}
                          value={formatScore(team.actualScore, 2)}
                          winner={team === winner}
                        />
                      ))}
                    </div>
                    <p className="mt-auto flex items-center gap-1.5 pt-3 text-[11px] text-muted-foreground">
                      <RotateCw className="size-3" aria-hidden="true" /> Tap for
                      the round-up
                    </p>
                  </div>
                }
                back={
                  <div className="score-card flex flex-col">
                    <p className="ui-kicker text-primary">
                      {matchup.review ? 'The round-up' : 'Final'}
                    </p>
                    <p className="mt-2 line-clamp-3 pr-8 text-base font-bold leading-snug tracking-tight">
                      {matchup.review?.headline ??
                        (winner ? `${winner.teamName} take it.` : title)}
                    </p>
                    {winner && margin != null && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {winner.teamName} by {formatScore(margin, 2)}
                      </p>
                    )}
                    <a
                      href={href(matchup)}
                      className="clubhouse-text-link mt-auto min-h-11 pt-2"
                    >
                      {matchup.review ? 'Read the report' : 'See the matchup'}{' '}
                      <ArrowRight className="size-4" />
                    </a>
                  </div>
                }
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
