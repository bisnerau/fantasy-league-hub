import type { Metadata } from 'next';
import { Users } from 'lucide-react';
import {
  ManagersList,
  type ManagerEntry,
} from '@/components/managers/managers-list';
import { leagueConfig } from '@/lib/config/league.config';
import {
  franchiseColors,
  getFranchiseRecords,
  type HistoricalSeason,
} from '@/lib/data/historical';
import { managers } from '@/lib/data/managers';
import { forfeits } from '@/lib/data/wall-of-shame';
import {
  getHistoricalArchive,
  ownerFranchiseMap,
} from '@/lib/data/verified-history';
import { getLeagueUsers } from '@/lib/sleeper/client';

export const metadata: Metadata = {
  title: 'Managers',
  description:
    'Every MAC 12 franchise - all-time records, season history, and manager profiles.',
};

export const revalidate = 3600;

function getSeasonHistory(franchiseId: string, seasons: HistoricalSeason[]) {
  const results: {
    year: number;
    wins: number;
    losses: number;
    finish: number;
  }[] = [];
  for (const season of seasons) {
    const standing = season.standings.find(
      (s) => s.franchiseId === franchiseId,
    );
    if (standing) {
      results.push({
        year: season.year,
        wins: standing.wins,
        losses: standing.losses,
        finish: standing.finish,
      });
    }
  }
  return results;
}

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

export default async function ManagersPage() {
  const [seasons, avatars] = await Promise.all([
    getHistoricalArchive(),
    getFranchiseAvatars(),
  ]);
  const records = getFranchiseRecords(seasons);

  const entries: ManagerEntry[] = records.map((record, index) => {
    const manager = managers.find((m) => m.franchiseId === record.franchiseId);
    const seasonHistory = getSeasonHistory(record.franchiseId, seasons);
    const franchiseForfeits = forfeits.filter(
      (f) => f.franchiseId === record.franchiseId,
    );

    return {
      franchiseId: record.franchiseId,
      rank: index + 1,
      managerName: manager?.name ?? record.currentName,
      teamName: record.currentName,
      joined: manager?.joined ?? 2020,
      bio: manager?.bio ?? null,
      avatar: avatars[record.franchiseId] ?? null,
      color: franchiseColors[record.franchiseId] ?? '#888',
      wins: record.wins,
      losses: record.losses,
      ties: record.ties,
      championships: record.championships,
      playoffAppearances: record.playoffAppearances,
      bestFinish: Math.min(...seasonHistory.map((s) => s.finish)),
      worstFinish: Math.max(...seasonHistory.map((s) => s.finish)),
      aliases: record.aliases,
      seasonHistory,
      forfeits: franchiseForfeits.map((f) => ({
        year: f.year,
        forfeit: f.forfeit,
      })),
    };
  });

  return (
    <div className="space-y-7">
      <section className="records-hero">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-primary" />
            <p className="section-kicker text-primary">
              The franchises · Est. 2020
            </p>
          </div>
          <h1 className="mt-3 max-w-3xl font-heading text-3xl font-black leading-none tracking-[-0.045em] sm:text-5xl">
            12 managers.
            <br />
            <span className="text-primary">Every story told.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Season-by-season records, championship rings, and the occasional
            forfeit. The full history of every MAC 12 franchise.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-2 sm:max-w-md lg:ml-auto lg:w-full">
          <div className="record-stat">
            <span>{managers.length}</span>
            <small>Managers</small>
          </div>
          <div className="record-stat">
            <span>{seasons.length}</span>
            <small>Seasons</small>
          </div>
          <div className="record-stat">
            <span>{records.filter((r) => r.championships > 0).length}</span>
            <small>Champions</small>
          </div>
        </div>
      </section>

      <ManagersList entries={entries} />
    </div>
  );
}
