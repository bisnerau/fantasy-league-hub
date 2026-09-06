import type { Metadata } from 'next';
import { Activity, ShieldCheck, Target, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { StandingsTable } from '@/components/standings/standings-table';
import { getDashboardData } from '@/lib/data/dashboard';
import { formatScore } from '@/lib/sleeper/scores';

export const metadata: Metadata = {
  title: 'Standings',
  description: 'The live playoff race, points table, and median standings.',
};

export const revalidate = 300;

export default async function StandingsPage() {
  const data = await getDashboardData();
  const leader = data.standings[0];
  const scoringLeader = data.standings
    .filter((team) => team.pointsFor != null)
    .sort(
      (a, b) => (b.pointsFor ?? -Infinity) - (a.pointsFor ?? -Infinity) || 0,
    )[0];
  const toughest = data.standings
    .filter((team) => team.pointsAgainst != null)
    .sort(
      (a, b) =>
        (a.pointsAgainst ?? Infinity) - (b.pointsAgainst ?? Infinity) || 0,
    )[0];
  const bubble = data.standings[5];
  const seasonStarted = data.standings.some(
    (team) => team.wins + team.losses + team.ties > 0,
  );

  const summaries = [
    {
      label: 'Top seed',
      value: leader?.teamName,
      detail: `${leader?.wins}-${leader?.losses}`,
      icon: Trophy,
    },
    {
      label: 'Scoring leader',
      value: scoringLeader?.teamName,
      detail: `${formatScore(scoringLeader?.pointsFor)} PF`,
      icon: Activity,
    },
    {
      label: 'Fewest points faced',
      value: toughest?.teamName,
      detail: `${formatScore(toughest?.pointsAgainst)} PA`,
      icon: ShieldCheck,
    },
    {
      label: 'Playoff cut',
      value: bubble?.teamName,
      detail: `${bubble?.wins}-${bubble?.losses}`,
      icon: Target,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 border-b border-white/8 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="section-kicker">
            {data.season} · Week {data.week}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-black tracking-[-0.04em] sm:text-5xl">
            The playoff race.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Every win matters. Median record strips out schedule luck and shows
            who is really scoring like a contender.
          </p>
        </div>
        <span className="w-fit rounded-full border border-white/8 bg-white/[0.035] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {data.mode === 'live' ? 'Sleeper league data' : 'Data unavailable'}
        </span>
      </section>

      {seasonStarted ? (
        <section className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {summaries.map((summary) => {
            const Icon = summary.icon;
            return (
              <Card key={summary.label} className="gap-0 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="metric-label">{summary.label}</p>
                    <p className="mt-2 break-words text-sm font-bold">
                      {summary.value ?? 'Unavailable'}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-primary">
                      {summary.detail}
                    </p>
                  </div>
                  <Icon className="size-4 shrink-0 text-muted-foreground" />
                </div>
              </Card>
            );
          })}
        </section>
      ) : (
        <p className="notice">
          {data.mode === 'unavailable'
            ? 'League standings are temporarily unavailable. Please refresh to try again.'
            : 'A clean slate. There are no seeds or scoring leaders until results are recorded.'}
        </p>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="section-kicker">League table</p>
            <h2 className="mt-1 font-heading text-xl font-black">
              All twelve franchises
            </h2>
          </div>
          <span className="hidden text-[10px] text-muted-foreground sm:block">
            Tap any column heading to sort
          </span>
        </div>
        <StandingsTable
          standings={data.standings}
          historyAvailable={data.weeklyHistoryAvailable}
        />
      </section>
    </div>
  );
}
