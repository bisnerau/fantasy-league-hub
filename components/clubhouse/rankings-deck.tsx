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
  avatars,
}: {
  ranking: PowerRankingEdition;
  avatars: Map<number, string | null>;
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
            Movement {comparison.label}
          </p>
        </div>
      </div>
      <CardDeck
        label={`Week ${ranking.week} power rankings`}
        items={ranking.entries.map((entry, index) => ({
          key: String(entry.rosterId),
          content: (
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-3">
                <span className="deck-rank">{index + 1}</span>
                <TeamAvatar
                  avatar={avatars.get(entry.rosterId) ?? null}
                  name={entry.manager}
                  className="size-11"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{entry.manager}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.record} · {entry.recentPoints} pts in Week{' '}
                    {ranking.throughWeek}
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
        }))}
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
