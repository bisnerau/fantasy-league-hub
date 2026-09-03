'use client';

import { Crown, Medal, Star } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { TeamAvatar } from '@/components/shared/team-avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export type ManagerEntry = {
  franchiseId: string;
  rank: number;
  managerName: string;
  teamName: string;
  joined: number;
  bio: string | null;
  avatar: string | null;
  color: string;
  wins: number;
  losses: number;
  ties: number;
  championships: number;
  playoffAppearances: number;
  bestFinish: number;
  worstFinish: number;
  aliases: string[];
  seasonHistory: {
    year: number;
    wins: number;
    losses: number;
    finish: number;
  }[];
  forfeits: { year: number; forfeit: string }[];
};

function winPct(wins: number, losses: number, ties: number) {
  const games = wins + losses + ties;
  return games ? (wins + ties * 0.5) / games : 0;
}

function finishLabel(finish: number) {
  if (finish === 1) return '1st';
  if (finish === 2) return '2nd';
  if (finish === 3) return '3rd';
  return `${finish}th`;
}

export function ManagersList({ entries }: { entries: ManagerEntry[] }) {
  const initialHash = useMemo(() => {
    if (typeof window === 'undefined') return [];
    const hash = window.location.hash.slice(1);
    return hash && entries.some((e) => e.franchiseId === hash) ? [hash] : [];
  }, [entries]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, []);

  return (
    <Accordion
      className="space-y-3"
      defaultValue={initialHash}
    >
      {entries.map((entry) => (
        <Card key={entry.franchiseId} id={entry.franchiseId} className="overflow-hidden p-0">
          <AccordionItem value={entry.franchiseId} className="border-none">
            <AccordionTrigger className="w-full gap-4 px-5 py-4 hover:no-underline sm:px-6">
              <div className="flex min-w-0 flex-1 items-center gap-3.5">
                <span className="shrink-0 font-mono text-lg font-black text-muted-foreground">
                  {String(entry.rank).padStart(2, '0')}
                </span>
                <TeamAvatar
                  avatar={entry.avatar}
                  name={entry.teamName}
                  className="size-10 shrink-0"
                />
                <div className="min-w-0 text-left">
                  <h2 className="flex items-center gap-2 font-heading text-base font-black leading-tight sm:text-lg">
                    <span className="truncate">{entry.teamName}</span>
                    {entry.championships > 0 && (
                      <span className="inline-flex shrink-0 items-center gap-0.5">
                        {Array.from({ length: entry.championships }).map(
                          (_, i) => (
                            <Star
                              key={i}
                              className="size-3.5 fill-primary text-primary"
                            />
                          ),
                        )}
                      </span>
                    )}
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {entry.managerName} · Since {entry.joined}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-base font-black sm:text-lg">
                  {entry.wins}-{entry.losses}
                  {entry.ties ? `-${entry.ties}` : ''}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {(winPct(entry.wins, entry.losses, entry.ties) * 100).toFixed(
                    1,
                  )}
                  %
                </p>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-5 pb-5 sm:px-6 sm:pb-6">
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      Titles
                    </p>
                    <p className="mt-0.5 font-mono text-sm font-black">
                      {entry.championships}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      Playoffs
                    </p>
                    <p className="mt-0.5 font-mono text-sm font-black">
                      {entry.playoffAppearances}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      Best
                    </p>
                    <p className="mt-0.5 font-mono text-sm font-black">
                      {finishLabel(entry.bestFinish)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      Worst
                    </p>
                    <p className="mt-0.5 font-mono text-sm font-black">
                      {finishLabel(entry.worstFinish)}
                    </p>
                  </div>
                </div>

                {entry.bio && (
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {entry.bio}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Season by season
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.seasonHistory.map((season) => (
                      <div
                        key={season.year}
                        className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs"
                      >
                        <span className="font-mono font-bold text-muted-foreground">
                          {season.year}
                        </span>
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
                          {season.finish === 1 && (
                            <Crown className="mr-1 size-3" />
                          )}
                          {season.finish > 1 && season.finish <= 3 && (
                            <Medal className="mr-1 size-3" />
                          )}
                          {finishLabel(season.finish)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {entry.aliases.length > 1 && (
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      Previously known as
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {entry.aliases
                        .filter((a) => a !== entry.teamName)
                        .join(' → ')}
                    </p>
                  </div>
                )}

                {entry.forfeits.length > 0 && (
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      <Star className="mr-1 inline size-3 text-primary" />
                      Wall of shame
                    </p>
                    <div className="mt-1.5 space-y-1">
                      {entry.forfeits.map((f) => (
                        <p
                          key={f.year}
                          className="text-xs text-muted-foreground"
                        >
                          <span className="font-mono font-bold">{f.year}</span>{' '}
                          - {f.forfeit}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Card>
      ))}
    </Accordion>
  );
}
