'use client';

import { ChevronDown, NotebookText } from 'lucide-react';
import { TeamAvatar } from '@/components/shared/team-avatar';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { MatchOfTheWeek } from '@/lib/data/match-of-the-week';
import type {
  PredictionMatchup,
  PredictionPlayer,
  PredictionTeam,
} from '@/lib/data/predictions';
import type { Rivalry } from '@/lib/data/rivalries';
import { formatScore } from '@/lib/sleeper/scores';
import { MatchupEditorial } from './matchup-editorial';
import { RivalryStrip } from './rivalry-strip';

function PlayerRow({ player }: { player: PredictionPlayer }) {
  return (
    <div className="grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-border py-2.5 last:border-0">
      <span className="font-mono text-xs font-bold text-primary">
        {player.slot.replace('_FLEX', '')}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium">
          {player.name}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {player.position} · {player.nflTeam}
        </span>
      </span>
      <span className="font-mono text-[11px] text-muted-foreground">
        {formatScore(player.projectedPoints)}
      </span>
    </div>
  );
}

function LineupColumn({ team }: { team: PredictionTeam }) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-muted/20 p-3">
      <div className="mb-2 flex items-center gap-2">
        <TeamAvatar
          avatar={team.avatar}
          name={team.teamName}
          className="size-7"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{team.teamName}</p>
          <p className="text-xs text-muted-foreground">Starting lineup</p>
        </div>
      </div>
      <div>
        {team.starters.map((player) => (
          <PlayerRow key={player.id} player={player} />
        ))}
      </div>
      <details className="group mt-2">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded-md px-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground">
          Bench · {team.bench.length}
          <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
        </summary>
        <div>
          {team.bench.length ? (
            team.bench.map((player) => (
              <PlayerRow key={player.id} player={player} />
            ))
          ) : (
            <p className="py-3 text-[11px] text-muted-foreground">
              No bench players yet.
            </p>
          )}
        </div>
      </details>
    </div>
  );
}

/**
 * Everything behind the pick: the report, the history, both lineups and the
 * Match of the Week reasoning, in a bottom sheet so the card stays clean. The
 * sheet's content only mounts while it is open.
 */
export function MatchupProgramme({
  matchup,
  feature,
  rivalry,
  lockAt,
  locked,
  finalized,
  receipt,
}: {
  matchup: PredictionMatchup;
  feature?: MatchOfTheWeek;
  rivalry?: Rivalry;
  lockAt: string;
  locked: boolean;
  finalized: boolean;
  receipt?: string;
}) {
  const title = `${matchup.home.ownerName} v ${matchup.away.ownerName}`;
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger
        className="programme-trigger"
        aria-label={`Programme: ${title}`}
      >
        <NotebookText className="size-4" aria-hidden="true" />
        Programme
      </DrawerTrigger>
      <DrawerContent className="sm:mx-auto sm:max-w-2xl">
        <DrawerHeader className="pb-3">
          <p className="ui-kicker">Match programme</p>
          <DrawerTitle className="text-xl font-bold tracking-tight">
            {title}
          </DrawerTitle>
          <DrawerDescription className="text-xs">
            {matchup.home.teamName} v {matchup.away.teamName}
          </DrawerDescription>
        </DrawerHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <Tabs defaultValue={feature ? 'why' : 'report'}>
            <TabsList
              aria-label="Programme sections"
              className="programme-tabs"
            >
              {feature && (
                <TabsTrigger value="why" className="min-h-10">
                  Why this one
                </TabsTrigger>
              )}
              <TabsTrigger value="report" className="min-h-10">
                Report
              </TabsTrigger>
              <TabsTrigger value="history" className="min-h-10">
                History
              </TabsTrigger>
              <TabsTrigger value="lineups" className="min-h-10">
                Lineups
              </TabsTrigger>
            </TabsList>
            {feature && (
              <TabsContent value="why" className="pt-3">
                <h3 className="text-sm font-semibold text-primary">
                  {finalized ? 'Why we chose it' : 'Why this one?'}
                </h3>
                <p className="mt-2 text-base leading-7">{feature.reason}</p>
                {!finalized && (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.buildUp}
                  </p>
                )}
              </TabsContent>
            )}
            <TabsContent value="report" className="-mx-3.5 sm:-mx-4">
              <MatchupEditorial
                matchup={matchup}
                featured={Boolean(feature)}
                lockAt={lockAt}
                locked={locked}
                finalized={finalized}
                receipt={receipt}
              />
            </TabsContent>
            <TabsContent value="history" className="-mx-3.5 pt-3 sm:-mx-4">
              {rivalry ? (
                <RivalryStrip rivalry={rivalry} matchup={matchup} />
              ) : (
                <p className="px-3.5 py-2 text-sm leading-6 text-muted-foreground sm:px-4">
                  No verified history for this pairing yet.
                </p>
              )}
            </TabsContent>
            <TabsContent value="lineups" className="pt-3">
              <div className="grid gap-3 md:grid-cols-2">
                <LineupColumn team={matchup.home} />
                <LineupColumn team={matchup.away} />
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                Lineups and PPR estimates are reference only; use Sleeper for
                league-scored projections and live scores.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
