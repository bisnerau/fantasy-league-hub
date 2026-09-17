import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { leagueConfig } from '@/lib/config/league.config';
import {
  getPowerRankingComparison,
  getPowerRankingEditions,
} from '@/lib/data/power-rankings';
import { leagueMembers } from '@/lib/data/member-directory';
import { formatLockTime } from '@/lib/predictions/rules';
import { RankMovement } from '@/components/power-rankings/rank-movement';

export const metadata: Metadata = {
  title: 'Power Rankings',
  description:
    'The weekly MAC 12 pecking order: form, roster strength and twelve things to argue about.',
};
export const dynamic = 'force-dynamic';

export default async function PowerRankingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ season?: string; week?: string }>;
}) {
  const params = await searchParams;
  const editions = getPowerRankingEditions(
    leagueConfig.sleeperLeagueId,
    params?.season,
  );
  const requested = params?.week !== undefined;
  const edition = requested
    ? editions.find((e) => e.week === Number(params.week))
    : editions[0];
  if (!edition)
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Power rankings</h1>
        <p className="text-base text-muted-foreground">
          {requested
            ? 'No published power rankings for this week.'
            : 'The first weekly power rankings are still to come.'}
        </p>
        <a href="/" className="clubhouse-text-link">
          Back to the clubhouse <ArrowRight className="size-4" />
        </a>
      </section>
    );
  const comparison = getPowerRankingComparison(edition);
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <p className="ui-kicker text-primary">
          Week {edition.week} · {edition.season} · Editorial rankings
        </p>
        <h1 className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          Power rankings
        </h1>
        <h2 className="text-xl font-semibold">{edition.headline}</h2>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground">
          {edition.introduction}
        </p>
        <p className="text-sm text-muted-foreground">
          Published{' '}
          <time dateTime={edition.publishedAt}>
            {formatLockTime(edition.publishedAt)}
          </time>{' '}
          · Results through Week {edition.throughWeek}
        </p>
      </header>
      <nav aria-label="Power ranking editions" className="flex flex-wrap gap-2">
        {getPowerRankingEditions(leagueConfig.sleeperLeagueId).map((e) => (
          <a
            key={`${e.season}-${e.week}`}
            href={`/power-rankings?season=${e.season}&week=${e.week}`}
            aria-current={e === edition ? 'page' : undefined}
            className={`rounded-lg border px-3 py-2 text-sm ${e === edition ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
          >
            {e.season} · Week {e.week}
          </a>
        ))}
      </nav>
      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-wrap justify-between gap-2 border-b border-border px-4 py-3 text-sm text-muted-foreground sm:px-5">
          <span>The pecking order · All {edition.entries.length} managers</span>
          {comparison.href ? (
            <a className="underline underline-offset-4" href={comparison.href}>
              Movement {comparison.label}
            </a>
          ) : (
            <span>{comparison.label}</span>
          )}
        </div>
        <ol className="divide-y divide-border">
          {edition.entries.map((entry, index) => {
            const manager = leagueMembers.find(
              (member) => member.rosterId === entry.rosterId,
            );
            return (
              <li
                key={entry.rosterId}
                data-power-roster={entry.rosterId}
                className="grid grid-cols-[2rem_minmax(0,1fr)_2.75rem] gap-x-3 px-4 py-5 sm:grid-cols-[3rem_minmax(0,1fr)_4rem] sm:px-5"
              >
                <span
                  className={`font-mono text-xl font-semibold ${index === 0 ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <a
                    href={`/managers#${manager?.franchiseId ?? ''}`}
                    className="text-base font-semibold hover:text-primary sm:text-lg"
                  >
                    {entry.manager}
                  </a>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {entry.record} head-to-head ·{' '}
                    {entry.recentPoints.toFixed(2)} points in Week{' '}
                    {edition.throughWeek}
                  </p>
                  <p className="mt-2 text-base leading-7">{entry.verdict}</p>
                </div>
                <div className="text-right">
                  <RankMovement
                    rank={index + 1}
                    previousRank={comparison.ranks.get(entry.rosterId)}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <section
        className="space-y-2 text-sm leading-6 text-muted-foreground"
        aria-labelledby="ranking-method"
      >
        <h2
          id="ranking-method"
          className="text-base font-semibold text-foreground"
        >
          How we choose the order
        </h2>
        <p>
          Recent scoring, results, roster strength and availability inform an
          editorial judgment of each team’s current strength. With one completed
          week, the first edition balances that opener against the roster rather
          than treating every win equally. Future editions consider up to three
          completed weeks of form.
        </p>
        <p>
          The first arrows compare with the published preseason finishing
          forecast; later arrows compare with the previous weekly edition. These
          are separate from league standings. Each published list stays in the
          archive.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {edition.sources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              {source.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
