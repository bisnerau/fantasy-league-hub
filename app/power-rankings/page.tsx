import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { leagueConfig } from '@/lib/config/league.config';
import { TalkingPoints } from '@/components/clubhouse/lead-story';
import { MarketBoard } from '@/components/power-rankings/market-board';
import { MarketReport } from '@/components/power-rankings/market-report';
import { RankHistory } from '@/components/power-rankings/rank-history';
import {
  RankingsList,
  type RankingRow,
} from '@/components/power-rankings/rankings-list';
import { getTeamIdentities } from '@/lib/data/dashboard';
import {
  getMarketMovers,
  getMarketReport,
  getPowerRankingComparison,
  getPowerRankingEditions,
  getRankHistory,
  getRankMoves,
  type RankMove,
} from '@/lib/data/power-rankings';
import { leagueMembers } from '@/lib/data/member-directory';
import { formatLockTime } from '@/lib/predictions/rules';

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
  const moves = getRankMoves(edition, comparison);
  const identities = await getTeamIdentities(edition.leagueId);
  const rows: RankingRow[] = edition.entries.map((entry, index) => {
    const identity = identities.get(entry.rosterId);
    const franchiseId =
      identity?.franchiseId ??
      leagueMembers.find((member) => member.rosterId === entry.rosterId)
        ?.franchiseId;
    return {
      rosterId: entry.rosterId,
      rank: index + 1,
      previousRank: moves[index].previousRank,
      teamName: identity?.teamName ?? entry.manager,
      manager: entry.manager,
      avatar: identity?.avatar ?? null,
      record: entry.record,
      points: entry.recentPoints,
      verdict: entry.verdict,
      href: franchiseId ? `/managers#${franchiseId}` : '/managers',
    };
  });
  const row = (move?: RankMove) =>
    move && rows.find((candidate) => candidate.rosterId === move.rosterId);
  const { riser, faller } = getMarketMovers(moves);
  const history = getRankHistory(edition.leagueId, edition.season);
  const historySeries = rows.map((r) => ({
    rosterId: r.rosterId,
    teamName: r.teamName,
    ranks: history.series.get(r.rosterId) ?? [],
  }));
  const allEditions = getPowerRankingEditions(leagueConfig.sleeperLeagueId);

  return (
    <div className="space-y-8">
      <header>
        <p className="ui-kicker text-primary">
          Week {edition.week} · {edition.season} · Power rankings
        </p>
        <h1 className="mt-2 font-heading text-3xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl">
          {edition.headline}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          {edition.introduction}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Published{' '}
          <time dateTime={edition.publishedAt}>
            {formatLockTime(edition.publishedAt)}
          </time>{' '}
          · Results through Week {edition.throughWeek}
        </p>
      </header>

      <MarketBoard
        week={edition.week}
        label={comparison.label}
        top={rows[0]}
        riser={row(riser)}
        faller={row(faller)}
      />

      <nav aria-label="Power ranking editions" className="snap-rail">
        {allEditions.map((e) => (
          <a
            key={`${e.season}-${e.week}`}
            href={`/power-rankings?season=${e.season}&week=${e.week}`}
            aria-current={e === edition ? 'page' : undefined}
            className="edition-chip"
          >
            {e.season} · Week {e.week}
          </a>
        ))}
      </nav>

      <section aria-labelledby="order-title">
        <div className="section-heading">
          <div>
            <p className="ui-kicker text-primary">The pecking order</p>
            <h2 id="order-title" className="section-title">
              All {edition.entries.length} managers
            </h2>
          </div>
          {comparison.href ? (
            <a className="replay-button" href={comparison.href}>
              Movement {comparison.label}
            </a>
          ) : (
            <span className="text-xs text-muted-foreground">
              {comparison.label}
            </span>
          )}
        </div>
        <RankingsList
          rows={rows}
          caption={`Points from Week ${edition.throughWeek}. Tap a team for the verdict.`}
        />
      </section>

      <MarketReport items={getMarketReport(edition, moves)} rows={rows} />

      {history.columns.length > 1 && (
        <RankHistory
          columns={history.columns}
          series={historySeries}
          size={edition.entries.length}
        />
      )}

      <TalkingPoints points={edition.talkingPoints} />

      <details className="ranking-method">
        <summary>How we choose the order</summary>
        <div className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
          <p>
            Recent scoring, results, roster strength and availability inform an
            editorial judgment of each team’s current strength. With one
            completed week, the first edition balances that opener against the
            roster rather than treating every win equally. Future editions
            consider up to three completed weeks of form.
          </p>
          <p>
            The first arrows compare with the published preseason finishing
            forecast; later arrows compare with the previous weekly edition.
            These are separate from league standings. Each published list stays
            in the archive.
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
        </div>
      </details>
    </div>
  );
}
