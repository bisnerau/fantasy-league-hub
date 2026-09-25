import { ArrowRight } from 'lucide-react';
import { CardDeck } from '@/components/effects/card-deck';
import { RankMovement } from '@/components/power-rankings/rank-movement';
import { TeamAvatar } from '@/components/shared/team-avatar';
import {
  getPowerRankingComparison,
  type PowerRankingEdition,
} from '@/lib/data/power-rankings';

/** All twelve managers as a swipeable deck, labelled with the real edition. */
export function RankingsDeck({
  ranking,
  teams,
}: {
  ranking: PowerRankingEdition;
  teams: Map<number, { teamName: string; avatar: string | null }>;
}) {
  const comparison = getPowerRankingComparison(ranking);
  return (
    <section aria-labelledby="rankings-title">
      <div className="section-heading">
        <div className="min-w-0">
          <p className="ui-kicker text-primary">
            Power rankings · Week {ranking.week}
          </p>
          <h2 id="rankings-title" className="section-title">
            {ranking.headline}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Movement {comparison.label} · Points from Week {ranking.throughWeek}
          </p>
        </div>
      </div>
      <CardDeck
        label={`Week ${ranking.week} power rankings`}
        items={ranking.entries.map((entry, index) => {
          const team = teams.get(entry.rosterId);
          return {
            key: String(entry.rosterId),
            content: (
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <span className="deck-rank">{index + 1}</span>
                  <TeamAvatar
                    avatar={team?.avatar ?? null}
                    name={team?.teamName ?? entry.manager}
                    className="size-11"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">
                      {team?.teamName ?? entry.manager}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {team && `${entry.manager} · `}
                      {entry.record} · {entry.recentPoints} pts
                    </p>
                  </div>
                  <RankMovement
                    rank={index + 1}
                    previousRank={comparison.ranks.get(entry.rosterId)}
                  />
                </div>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground">
                  {entry.verdict}
                </p>
              </div>
            ),
          };
        })}
      />
      <a
        href={`/power-rankings?season=${ranking.season}&week=${ranking.week}`}
        className="clubhouse-text-link mt-1 min-h-11"
      >
        All 12 managers <ArrowRight className="size-4" />
      </a>
    </section>
  );
}
