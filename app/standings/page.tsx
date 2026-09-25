import type { Metadata } from 'next';
import { CutLineHero } from '@/components/standings/cut-line-hero';
import { LeagueTable } from '@/components/standings/league-table';
import { PointsRace } from '@/components/standings/points-race';
import { SuperlativesRail } from '@/components/standings/superlatives-rail';
import { getDashboardData } from '@/lib/data/dashboard';
import { gamesPlayed, getCutLine, getSuperlatives } from '@/lib/data/standings';

export const metadata: Metadata = {
  title: 'Standings',
  description: 'The live playoff race, points table, and median standings.',
};

export const revalidate = 300;

export default async function StandingsPage() {
  const data = await getDashboardData();
  const played = Math.max(0, ...data.standings.map(gamesPlayed));
  const cut = getCutLine(data.standings, data.playoffTeams);
  const superlatives = getSuperlatives(data.standings);
  const pointsKnown =
    played > 0 && data.standings.some((team) => team.pointsFor != null);

  return (
    <div className="space-y-8">
      <header>
        <p className="ui-kicker text-primary">
          {data.season}
          {data.season && ' · '}
          {played ? `After Week ${played}` : `Week ${data.week}`}
        </p>
        <h1 className="mt-2 font-heading text-4xl font-black leading-none tracking-[-0.05em] sm:text-5xl">
          The playoff race.
        </h1>
      </header>

      {data.mode === 'unavailable' ? (
        <p className="notice">
          League standings are temporarily unavailable. Please refresh to try
          again.
        </p>
      ) : (
        <>
          {cut ? (
            <CutLineHero cut={cut} week={played} />
          ) : (
            <p className="notice">
              A clean slate. There are no seeds or scoring leaders until results
              are recorded.
            </p>
          )}

          <section aria-labelledby="table-title">
            <LeagueTable
              heading={
                <>
                  <p className="ui-kicker text-primary">League table</p>
                  <h2 id="table-title" className="section-title">
                    All {data.standings.length} franchises
                  </h2>
                </>
              }
              standings={data.standings}
              playoffTeams={data.playoffTeams}
              historyAvailable={data.weeklyHistoryAvailable}
              week={played}
            />
          </section>

          {superlatives.length > 0 && <SuperlativesRail items={superlatives} />}
          {pointsKnown && <PointsRace standings={data.standings} />}
        </>
      )}
    </div>
  );
}
