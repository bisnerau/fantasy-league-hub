import { draftRecapContent } from '@/lib/data/draft-recap-content';
import type { Metadata } from 'next';
import { getSeasonHubData, featureLeagueId } from '@/lib/data/season-hub';
import { getPredictionWeekData } from '@/lib/data/predictions';
import { getDashboardData } from '@/lib/data/dashboard';
import { getWeeklyRivalries, type Rivalry } from '@/lib/data/rivalries';
import { getLeagueRosters } from '@/lib/sleeper/client';
import { MySeason } from '@/components/season/my-season';
import { GateTicket } from '@/components/season/season-ticket';
import { leagueConfig } from '@/lib/config/league.config';

export const metadata: Metadata = {
  title: 'My Season',
  description:
    'Your MAC 12 picks, waiver returns, trades, awards and season progress.',
};
export const dynamic = 'force-dynamic';
export default async function MySeasonPage() {
  const [hub, picks, rosters, dashboard] = await Promise.allSettled([
    getSeasonHubData({ includeActivity: true }),
    getPredictionWeekData().then(async (week) => ({
      week,
      rivalries: await getWeeklyRivalries(week).catch(
        (): Record<number, Rivalry> => ({}),
      ),
    })),
    getLeagueRosters(featureLeagueId),
    getDashboardData(),
  ]);
  const ballot =
    picks.status === 'fulfilled' &&
    picks.value.week.leagueId === featureLeagueId
      ? picks.value
      : null;
  // The dashboard follows the configured league; only reuse it for this one.
  const standings =
    leagueConfig.sleeperLeagueId === featureLeagueId &&
    dashboard.status === 'fulfilled' &&
    dashboard.value.mode === 'live' &&
    dashboard.value.standings.length
      ? dashboard.value.standings
      : null;
  const data = hub.status === 'fulfilled' ? hub.value : null;
  if (!data)
    return (
      <div className="space-y-5">
        <header>
          <p className="ui-kicker text-primary">Your MAC 12 · 2026</p>
          <h1 className="mt-2 font-heading text-3xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl">
            My Season
          </h1>
        </header>
        <div className="max-w-lg">
          <GateTicket title="The gates are closed for now">
            <p className="mt-2 text-sm text-muted-foreground">
              Season data is unavailable right now. Your picks remain on the
              Weekly picks page.
            </p>
            <a href="/my-season" className="season-link mt-3">
              Retry
            </a>
          </GateTicket>
        </div>
      </div>
    );
  return (
    <MySeason
      data={data}
      drafts={draftRecapContent.entries.map((e) => ({
        rosterId: e.rosterId,
        grade: e.grade,
        gradeScore: e.gradeScore,
        predictedFinish: e.predictedFinish,
        headline: e.headline,
      }))}
      picks={ballot?.week ?? null}
      rivalries={ballot?.rivalries ?? {}}
      rosters={rosters.status === 'fulfilled' ? rosters.value : null}
      standings={standings}
    />
  );
}
