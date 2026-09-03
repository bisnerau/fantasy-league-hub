import type { Metadata } from 'next';
import { Crown, Medal, Star, Trophy, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  franchiseColors,
  getFranchiseRecords,
  type HistoricalSeason,
} from '@/lib/data/historical';
import { managers } from '@/lib/data/managers';
import { forfeits } from '@/lib/data/wall-of-shame';
import { getHistoricalArchive } from '@/lib/data/verified-history';

export const metadata: Metadata = {
  title: 'Managers',
  description: 'Every MAC 12 franchise — all-time records, season history, and manager profiles.',
};

export const revalidate = 3600;

function winPct(wins: number, losses: number, ties: number) {
  const games = wins + losses + ties;
  return games ? (wins + ties * 0.5) / games : 0;
}

function getSeasonHistory(franchiseId: string, seasons: HistoricalSeason[]) {
  return seasons
    .map((season) => {
      const standing = season.standings.find((s) => s.franchiseId === franchiseId);
      if (!standing) return null;
      return { year: season.year, ...standing, leagueSize: season.standings.length };
    })
    .filter(Boolean);
}

function finishLabel(finish: number) {
  if (finish === 1) return '1st';
  if (finish === 2) return '2nd';
  if (finish === 3) return '3rd';
  return `${finish}th`;
}

export default async function ManagersPage() {
  const seasons = await getHistoricalArchive();
  const records = getFranchiseRecords(seasons);

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

      <section className="space-y-4">
        {records.map((record, rank) => {
          const manager = managers.find((m) => m.franchiseId === record.franchiseId);
          const seasonHistory = getSeasonHistory(record.franchiseId, seasons);
          const franchiseForfeits = forfeits.filter((f) => f.franchiseId === record.franchiseId);
          const bestFinish = Math.min(...seasonHistory.map((s) => s.finish));
          const worstFinish = Math.max(...seasonHistory.map((s) => s.finish));
          const color = franchiseColors[record.franchiseId];

          return (
            <Card key={record.franchiseId} className="overflow-hidden p-0">
              <div className="border-b border-white/[0.055] p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <span className="font-mono text-xl font-black text-muted-foreground">
                      {String(rank + 1).padStart(2, '0')}
                    </span>
                    <span
                      aria-hidden="true"
                      className="size-4 rounded-full ring-4 ring-white/[0.04]"
                      style={{ background: color }}
                    />
                    <div>
                      <h2 className="flex items-center gap-2 font-heading text-xl font-black">
                        {manager?.name ?? record.currentName}
                        {record.championships > 0 && (
                          <span className="inline-flex items-center gap-1">
                            {Array.from({ length: record.championships }).map((_, i) => (
                              <Trophy key={i} className="size-4 fill-primary text-primary" />
                            ))}
                          </span>
                        )}
                      </h2>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {record.currentName}
                        {manager ? ` · Since ${manager.joined}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="font-mono text-lg font-black">
                        {record.wins}-{record.losses}
                        {record.ties ? `-${record.ties}` : ''}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {(winPct(record.wins, record.losses, record.ties) * 100).toFixed(1)}% win rate
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Titles</p>
                    <p className="mt-0.5 font-mono text-sm font-black">{record.championships}</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Playoffs</p>
                    <p className="mt-0.5 font-mono text-sm font-black">{record.playoffAppearances}</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Best</p>
                    <p className="mt-0.5 font-mono text-sm font-black">{finishLabel(bestFinish)}</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Worst</p>
                    <p className="mt-0.5 font-mono text-sm font-black">{finishLabel(worstFinish)}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Season by season</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {seasonHistory.map((season) => (
                    <div
                      key={season.year}
                      className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs"
                    >
                      <span className="font-mono font-bold text-muted-foreground">{season.year}</span>
                      <span className="font-mono">
                        {season.wins}-{season.losses}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          season.finish === 1
                            ? 'border-primary/30 bg-primary/10 text-primary'
                            : season.finish <= 3
                              ? 'border-white/10 bg-white/5 text-foreground'
                              : 'border-white/8 text-muted-foreground'
                        }
                      >
                        {season.finish === 1 && <Crown className="mr-1 size-3" />}
                        {season.finish > 1 && season.finish <= 3 && <Medal className="mr-1 size-3" />}
                        {finishLabel(season.finish)}
                      </Badge>
                    </div>
                  ))}
                </div>

                {record.aliases.length > 1 && (
                  <div className="mt-4">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Previously known as</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {record.aliases.filter((a) => a !== record.currentName).join(' → ')}
                    </p>
                  </div>
                )}

                {franchiseForfeits.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      <Star className="mr-1 inline size-3 text-primary" />
                      Wall of shame
                    </p>
                    <div className="mt-1.5 space-y-1">
                      {franchiseForfeits.map((f) => (
                        <p key={f.year} className="text-xs text-muted-foreground">
                          <span className="font-mono font-bold">{f.year}</span> — {f.forfeit}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
