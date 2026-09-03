import type { Metadata } from 'next';
import { Archive, Crown, Medal, Star, Trophy } from 'lucide-react';
import { TeamAvatar } from '@/components/shared/team-avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { leagueConfig } from '@/lib/config/league.config';
import { franchiseColors, getFranchiseRecords } from '@/lib/data/historical';
import {
  getHistoricalArchive,
  ownerFranchiseMap,
} from '@/lib/data/verified-history';
import { getLeagueUsers } from '@/lib/sleeper/client';

export const metadata: Metadata = {
  title: 'Record Book',
  description:
    'League champions, all-time franchise records, and season archives.',
};

function winPercentage(wins: number, losses: number, ties: number) {
  const games = wins + losses + ties;
  return games ? (wins + ties * 0.5) / games : 0;
}

export const revalidate = 3600;

async function getFranchiseAvatars(): Promise<Record<string, string | null>> {
  if (!leagueConfig.sleeperLeagueId) return {};
  try {
    const users = await getLeagueUsers(leagueConfig.sleeperLeagueId);
    const avatars: Record<string, string | null> = {};
    for (const user of users) {
      const franchiseId = ownerFranchiseMap[user.user_id];
      if (franchiseId) {
        avatars[franchiseId] =
          leagueConfig.teamAvatarOverrides[user.user_id] ??
          user.metadata?.avatar ??
          user.avatar ??
          null;
      }
    }
    return avatars;
  } catch {
    return {};
  }
}

export default async function RecordsPage() {
  const [seasons, avatars] = await Promise.all([
    getHistoricalArchive(),
    getFranchiseAvatars(),
  ]);
  const records = getFranchiseRecords(seasons);
  const leader = records[0];
  const totalGames =
    records.reduce(
      (sum, record) => sum + record.wins + record.losses + record.ties,
      0,
    ) / 2;
  const latestSeason = seasons.at(-1);
  const reigningChampFranchise = latestSeason?.standings.find(
    (s) => s.finish === 1,
  )?.franchiseId;

  return (
    <div className="space-y-7">
      <section className="records-hero">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <Archive className="size-4 text-primary" />
            <p className="section-kicker text-primary">
              League archive · 2020–{seasons.at(-1)?.year}
            </p>
          </div>
          <h1 className="mt-3 max-w-3xl font-heading text-3xl font-black leading-none tracking-[-0.045em] sm:text-5xl">
            {seasons.length} seasons.
            <br />
            <span className="text-primary">Every finish remembered.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            The original 2020–2024 tables are transcribed from the league
            archive. Connected Sleeper seasons are pulled directly from the API
            and marked as verified.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-2 sm:max-w-md lg:ml-auto lg:w-full">
          <div className="record-stat">
            <span>{seasons.length}</span>
            <small>Seasons</small>
          </div>
          <div className="record-stat">
            <span>{Math.round(totalGames)}</span>
            <small>Games</small>
          </div>
          <div className="record-stat">
            <span>{leader?.wins ?? 0}</span>
            <small>Win leader</small>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="section-kicker">Championship history</p>
            <h2 className="mt-1 font-heading text-xl font-black">
              The trophy cabinet
            </h2>
          </div>
          <Badge
            variant="outline"
            className="border-white/10 text-[9px] text-muted-foreground"
          >
            MANUAL + SLEEPER
          </Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {[...seasons].reverse().map((season) => {
            const champion = season.standings.find(
              (team) => team.finish === 1,
            )!;
            return (
              <Card
                key={season.year}
                className="champion-card relative gap-0 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-primary">
                    {season.year}
                  </span>
                  <Crown className="size-4 text-primary" />
                </div>
                <div className="my-6 flex justify-center">
                  <span
                    className="champion-medal"
                    style={
                      {
                        '--franchise': franchiseColors[champion.franchiseId],
                      } as React.CSSProperties
                    }
                  >
                    <Trophy className="size-7" />
                  </span>
                </div>
                <p className="text-center text-xs font-black leading-5">
                  {season.champion}
                </p>
                <p className="mt-1 text-center font-mono text-[10px] text-muted-foreground">
                  {champion.wins}-{champion.losses} regular season
                </p>
                <p
                  className={`mt-3 text-center text-[8px] font-black uppercase tracking-[0.14em] ${season.source === 'sleeper' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {season.source === 'sleeper'
                    ? 'Sleeper verified'
                    : 'Manual archive'}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,.75fr)]">
        <div>
          <div className="mb-3">
            <p className="section-kicker">All-time table</p>
            <h2 className="mt-1 font-heading text-xl font-black">
              Franchise records
            </h2>
          </div>
          <Card className="gap-0 overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead>
                  <tr className="border-b border-white/8 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-3 py-3">Franchise</th>
                    <th className="px-3 py-3">Record</th>
                    <th className="px-3 py-3">Win %</th>
                    <th className="px-3 py-3">Titles</th>
                    <th className="px-3 py-3">Playoffs</th>
                    <th className="px-4 py-3 text-right">Seasons</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr
                      key={record.franchiseId}
                      className="border-b border-white/[0.055] last:border-0"
                    >
                      <td className="px-4 py-3 font-mono font-black text-muted-foreground">
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td
                        aria-label={`${record.currentName} franchise`}
                        className="px-3 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <TeamAvatar
                            avatar={avatars[record.franchiseId] ?? null}
                            name={record.currentName}
                            className="size-7"
                          />
                          <div>
                            <p className="flex items-center gap-1.5 font-bold">
                              {record.currentName}
                              {record.championships > 0 && (
                                <span className="inline-flex items-center gap-0.5">
                                  {record.franchiseId ===
                                  reigningChampFranchise ? (
                                    <span className="relative inline-flex items-center justify-center">
                                      <Star className="size-3.5 fill-primary text-primary" />
                                      <Crown className="absolute size-2 text-background" />
                                    </span>
                                  ) : (
                                    <Star className="size-3.5 fill-primary text-primary" />
                                  )}
                                  {record.championships > 1 && (
                                    <span className="text-[9px] font-black text-primary">
                                      ×{record.championships}
                                    </span>
                                  )}
                                </span>
                              )}
                            </p>
                            {record.aliases.length > 1 && (
                              <p className="mt-0.5 max-w-56 truncate text-[9px] text-muted-foreground">
                                Formerly:{' '}
                                {record.aliases
                                  .filter((a) => a !== record.currentName)
                                  .join(' · ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-mono font-bold">
                        {record.wins}-{record.losses}
                        {record.ties ? `-${record.ties}` : ''}
                      </td>
                      <td className="px-3 py-3 font-mono text-muted-foreground">
                        {(
                          winPercentage(
                            record.wins,
                            record.losses,
                            record.ties,
                          ) * 100
                        ).toFixed(1)}
                        %
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={
                            record.championships
                              ? 'font-mono font-black text-primary'
                              : 'text-muted-foreground'
                          }
                        >
                          {record.championships}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={
                            record.playoffAppearances
                              ? 'font-mono font-bold'
                              : 'text-muted-foreground'
                          }
                        >
                          {record.playoffAppearances}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                        {record.seasons}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div>
          <div className="mb-3">
            <p className="section-kicker">Season archive</p>
            <h2 className="mt-1 font-heading text-xl font-black">Podiums</h2>
          </div>
          <div className="space-y-2">
            {[...seasons].reverse().map((season) => (
              <Card key={season.year} className="gap-0 p-4">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-black text-primary">
                    {season.year}
                  </span>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <p className="flex items-center gap-2 truncate text-xs font-bold">
                      <Crown className="size-3 text-primary" />{' '}
                      {season.champion}
                    </p>
                    <p className="flex items-center gap-2 truncate text-[10px] text-muted-foreground">
                      <Medal className="size-3" /> {season.runnerUp} ·{' '}
                      {season.thirdPlace}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-[8px] ${season.source === 'sleeper' ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {season.source === 'sleeper'
                      ? 'VERIFIED'
                      : `${season.standings.length} TEAMS`}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <p className="text-center text-[10px] leading-5 text-muted-foreground">
        Franchise continuity for 2020–2024 is confirmed by league members; 2025
        onward is mapped by Sleeper owner ID.
      </p>
    </div>
  );
}
