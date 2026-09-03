'use client';

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PointsBars } from '@/components/charts/points-bars';
import { TeamAvatar } from '@/components/shared/team-avatar';
import type { TeamStanding } from '@/lib/data/dashboard';

type SortKey = 'rank' | 'wins' | 'pointsFor' | 'pointsAgainst' | 'medianWins';

function SortButton({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: 'asc' | 'desc';
  onSort: (key: SortKey) => void;
}) {
  const Icon =
    activeKey !== sortKey
      ? ArrowUpDown
      : direction === 'asc'
        ? ArrowUp
        : ArrowDown;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className="inline-flex items-center gap-1 hover:text-primary"
      aria-label={`Sort standings by ${label}`}
    >
      {label}
      <Icon className="size-3" />
    </button>
  );
}

export function StandingsTable({ standings }: { standings: TeamStanding[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const maxPoints = Math.max(
    ...standings.flatMap((team) => [team.pointsFor, team.pointsAgainst]),
    1,
  );
  const sorted = useMemo(
    () =>
      [...standings].sort((a, b) => {
        const delta = a[sortKey] - b[sortKey];
        return direction === 'asc' ? delta : -delta;
      }),
    [direction, sortKey, standings],
  );

  function sort(key: SortKey) {
    if (key === sortKey)
      setDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setDirection(key === 'rank' ? 'asc' : 'desc');
    }
  }

  return (
    <>
      <Card className="hidden gap-0 p-0 md:flex">
        <Table>
          <TableHeader>
            <TableRow className="border-white/8 hover:bg-transparent">
              <TableHead className="w-16 pl-5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <SortButton
                  label="Rank"
                  sortKey="rank"
                  activeKey={sortKey}
                  direction={direction}
                  onSort={sort}
                />
              </TableHead>
              <TableHead className="min-w-60 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                Franchise
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <SortButton
                  label="Record"
                  sortKey="wins"
                  activeKey={sortKey}
                  direction={direction}
                  onSort={sort}
                />
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <SortButton
                  label="PF / PA"
                  sortKey="pointsFor"
                  activeKey={sortKey}
                  direction={direction}
                  onSort={sort}
                />
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <SortButton
                  label="Median"
                  sortKey="medianWins"
                  activeKey={sortKey}
                  direction={direction}
                  onSort={sort}
                />
              </TableHead>
              <TableHead className="pr-5 text-right text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                Streak
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((team) => (
              <TableRow
                key={team.rosterId}
                className={`h-[68px] border-white/[0.055] ${team.rank === 6 ? 'border-b-2 border-b-primary/30' : ''}`}
              >
                <TableCell className="pl-5">
                  <span
                    className={`font-mono text-sm font-black ${team.rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {String(team.rank).padStart(2, '0')}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <TeamAvatar avatar={team.avatar} name={team.teamName} />
                    <div>
                      <p className="text-sm font-bold">{team.teamName}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        <a href={team.franchiseId ? `/managers#${team.franchiseId}` : '/managers'} className="hover:text-primary">{team.ownerName}</a>
                      </p>
                    </div>
                    {team.rank === 1 && (
                      <Badge className="ml-2 bg-primary/10 text-[9px] text-primary">
                        #1 SEED
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="score-number text-base">
                    {team.wins}-{team.losses}
                    {team.ties ? `-${team.ties}` : ''}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <PointsBars
                      pointsFor={team.pointsFor}
                      pointsAgainst={team.pointsAgainst}
                      max={maxPoints}
                    />
                    <div className="font-mono text-[9px] leading-4 text-muted-foreground">
                      <p>
                        <span className="inline-block w-5 text-primary">
                          PF
                        </span>
                        {team.pointsFor.toFixed(1)}
                      </p>
                      <p>
                        <span className="inline-block w-5 text-accent">PA</span>
                        {team.pointsAgainst.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs font-bold">
                    {team.medianWins}-{team.medianLosses}
                  </span>
                </TableCell>
                <TableCell className="pr-5 text-right">
                  <Badge
                    variant="outline"
                    className={
                      team.streak.startsWith('W')
                        ? 'border-primary/20 bg-primary/5 text-primary'
                        : 'border-accent/20 bg-accent/5 text-accent'
                    }
                  >
                    {team.streak}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center gap-5 border-t border-white/8 px-5 py-3 text-[9px] uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <i className="size-1.5 rounded-full bg-primary" /> Points for
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-1.5 rounded-full bg-accent" /> Points against
          </span>
          <span className="ml-auto text-primary">
            Playoff line after seed 6
          </span>
        </div>
      </Card>

      <div className="space-y-2 md:hidden">
        {sorted.map((team) => (
          <Card
            key={team.rosterId}
            className={`gap-0 p-4 ${team.rank === 6 ? 'border-b-2 border-b-primary/30' : ''}`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-5 font-mono text-sm font-black ${team.rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {team.rank}
              </span>
              <TeamAvatar avatar={team.avatar} name={team.teamName} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{team.teamName}</p>
                <p className="text-[10px] text-muted-foreground">
                  <a href={team.franchiseId ? `/managers#${team.franchiseId}` : '/managers'} className="hover:text-primary">{team.ownerName}</a>
                </p>
              </div>
              <span className="score-number text-lg">
                {team.wins}-{team.losses}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 border-t border-white/8 pt-3 text-center">
              <div>
                <p className="metric-label">Points for</p>
                <p className="mt-1 font-mono text-xs font-bold">
                  {team.pointsFor.toFixed(1)}
                </p>
              </div>
              <div className="border-x border-white/8">
                <p className="metric-label">Median</p>
                <p className="mt-1 font-mono text-xs font-bold">
                  {team.medianWins}-{team.medianLosses}
                </p>
              </div>
              <div>
                <p className="metric-label">Streak</p>
                <p
                  className={`mt-1 font-mono text-xs font-bold ${team.streak.startsWith('W') ? 'text-primary' : 'text-accent'}`}
                >
                  {team.streak}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
