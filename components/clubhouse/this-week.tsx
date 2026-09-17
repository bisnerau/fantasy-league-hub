import { ArrowRight, Star } from 'lucide-react';
import type { PredictionWeekData } from '@/lib/data/predictions';
import { getClubhouseEditorial } from '@/lib/data/clubhouse-editorial';
import { getPowerRankingComparison } from '@/lib/data/power-rankings';
import { RankMovement } from '@/components/power-rankings/rank-movement';

export function ThisWeek({
  data,
  reviewData,
}: {
  data: PredictionWeekData;
  reviewData: PredictionWeekData | null;
}) {
  const { lead, previews, reviews, ranking, talkingPoints } =
    getClubhouseEditorial(data, reviewData);
  const comparison = ranking ? getPowerRankingComparison(ranking) : null;
  const leadHref = `/matchups?week=${lead?.week ?? data.week}${lead ? `#matchup-${lead.matchup.sleeperMatchupId}` : ''}`;
  return (
    <section aria-labelledby="this-week-title" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="ui-kicker text-primary">
            Week {data.week} · {data.season}
          </p>
          <h2
            id="this-week-title"
            className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl"
          >
            This week in MAC 12
          </h2>
        </div>
        <a href="/matchups" className="clubhouse-text-link min-h-11">
          {data.locked ? 'See weekly picks' : 'Make your picks'}{' '}
          <ArrowRight className="size-4" />
        </a>
      </div>
      <div
        className={`grid gap-4 ${talkingPoints.length ? 'lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]' : ''}`}
      >
        <article className="rounded-xl border border-primary/25 bg-primary/[0.045] p-4 sm:p-6">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            {lead?.featured ? (
              <>
                <Star className="size-4" aria-hidden="true" /> Match of the Week
              </>
            ) : lead?.kind === 'review' ? (
              `Latest reports · Week ${lead.week}`
            ) : (
              `Week ${data.week} previews`
            )}
          </p>
          {lead?.featured && (
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              {lead.matchup.home.ownerName} vs {lead.matchup.away.ownerName}
            </p>
          )}
          <h3 className="mt-2 max-w-xl text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            <a className="hover:text-primary" href={leadHref}>
              {lead?.story.headline ?? `Week ${data.week}: the next chapter`}
            </a>
          </h3>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {lead?.story.summary ??
              'The next matchup reports are still to come. The weekly fixtures and picks are available in Weekly Picks.'}
          </p>
          <a href={leadHref} className="clubhouse-text-link mt-4 min-h-11">
            {lead
              ? `Read the ${lead.kind === 'review' ? 'report' : 'preview'}`
              : 'Open Weekly Picks'}{' '}
            <ArrowRight className="size-4" />
          </a>
        </article>
        {talkingPoints.length > 0 && (
          <div
            className="divide-y divide-border rounded-xl border border-border px-4 sm:px-5"
            aria-label="Three talking points"
          >
            {talkingPoints.map((point, index) => (
              <article key={point.title} className="py-4">
                <p className="mb-1 font-mono text-xs text-primary">
                  0{index + 1} / TALKING POINT
                </p>
                <h3 className="text-base font-semibold">
                  <a href={point.href} className="hover:text-primary">
                    {point.title}
                  </a>
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {point.text}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
      <nav
        aria-label="Latest league reports"
        className="flex flex-wrap gap-x-6 gap-y-2 border-y border-border py-2"
      >
        {previews.length > 0 && (
          <a
            className="clubhouse-text-link min-h-11"
            href={`/matchups?week=${data.week}`}
          >
            Week {data.week} previews · {previews.length} matchups{' '}
            <ArrowRight className="size-4" />
          </a>
        )}
        {reviews.length > 0 && (
          <a
            className="clubhouse-text-link min-h-11"
            href={`/matchups?week=${reviewData!.week}`}
          >
            Week {reviewData!.week} reviews · {reviews.length} reports{' '}
            <ArrowRight className="size-4" />
          </a>
        )}
        <a className="clubhouse-text-link min-h-11" href="/season-hub">
          Awards &amp; receipts <ArrowRight className="size-4" />
        </a>
      </nav>
      {ranking && comparison && (
        <section
          className="rounded-xl border border-border px-4 py-4 sm:px-5"
          aria-labelledby="home-rankings-title"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 id="home-rankings-title" className="text-lg font-bold">
                Power rankings{' '}
                <span className="font-normal text-muted-foreground">
                  · Week {ranking.week}
                </span>
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Movement {comparison.label}
              </p>
            </div>
            <a
              href={`/power-rankings?season=${ranking.season}&week=${ranking.week}`}
              className="clubhouse-text-link min-h-11"
            >
              All 12 managers <ArrowRight className="size-4" />
            </a>
          </div>
          <ol className="mt-3 grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {ranking.entries.slice(0, 3).map((entry, index) => (
              <li
                key={entry.rosterId}
                className="flex items-center gap-3 py-3 sm:px-3 sm:first:pl-0"
              >
                <span className="font-mono text-xl font-semibold text-primary">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 text-sm font-semibold">
                  {entry.manager}
                </span>
                <RankMovement
                  rank={index + 1}
                  previousRank={comparison.ranks.get(entry.rosterId)}
                />
              </li>
            ))}
          </ol>
        </section>
      )}
    </section>
  );
}
