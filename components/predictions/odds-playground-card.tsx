'use client';

import type { CSSProperties } from 'react';
import { Check, NotebookText, Star } from 'lucide-react';
import { TeamAvatar } from '@/components/shared/team-avatar';
import { Stamp } from '@/components/effects/stamp';
import { followSpotlight } from '@/components/effects/spotlight';
import { Badge } from '@/components/ui/badge';
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
import type { MatchupPreview } from '@/lib/predictions/stories';
import type { TrialMatchup, TrialTeam } from './odds-playground';
import { cn } from '@/lib/utils';

export function OddsPlaygroundCard({
  matchup,
  selectedId,
  result,
  adjusted,
  week,
  basis,
  feature,
  report,
  onPick,
  onResult,
}: {
  matchup: TrialMatchup;
  selectedId?: number;
  result?: number | 'tie';
  adjusted: boolean;
  week: number;
  basis: string;
  feature?: MatchOfTheWeek;
  report?: MatchupPreview;
  onPick: (id: number) => void;
  onResult: (result: number | 'tie') => void;
}) {
  const [home, away] = matchup.teams;
  const pickedSide =
    selectedId === home.id
      ? 'home'
      : selectedId === away.id
        ? 'away'
        : undefined;
  const favourite = home.chance >= away.chance ? home : away;
  const missing = matchup.teams.flatMap((t) => t.missing);
  return (
    <article
      className={cn('faceoff-card', feature && 'spotlight-card motw-card')}
      id={`trial-matchup-${matchup.id}`}
      data-pick={pickedSide}
      onPointerMove={feature ? followSpotlight : undefined}
      aria-label={`${home.name} versus ${away.name}`}
      style={
        {
          '--home-color': home.color,
          '--away-color': away.color,
        } as CSSProperties
      }
    >
      <div className="faceoff-header">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          {feature && (
            <Badge className="h-auto gap-1.5 px-2 py-0.5 text-xs">
              <Star aria-hidden="true" /> Match of the Week
            </Badge>
          )}
          <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            Matchup {matchup.id}
          </h2>
          <p className="faceoff-line">
            {home.fraction === away.fraction ? (
              <strong>Evens · pick ’em</strong>
            ) : (
              <>
                To win{' '}
                <strong>
                  {favourite.name.split(' ')[0]} {favourite.fraction}
                </strong>
              </>
            )}
          </p>
        </div>
        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          {result !== undefined ? 'Demo result' : 'Picks open'}
        </span>
      </div>
      <div className="faceoff">
        {matchup.teams.map((team, index) => {
          const picked = selectedId === team.id;
          const won = result === team.id;
          return (
            <div key={team.id} className="contents">
              {index === 1 && (
                <span className="faceoff-divider" aria-hidden="true">
                  <span>v</span>
                </span>
              )}
              <div
                className="faceoff-half"
                data-side={index === 0 ? 'home' : 'away'}
                data-selected={picked || undefined}
              >
                <TeamAvatar
                  avatar={team.avatar}
                  name={team.teamName}
                  className="size-9 sm:size-11"
                />
                <p className="faceoff-team">{team.teamName}</p>
                <p className="faceoff-owner">
                  {team.name} · {team.wins}–{team.losses}
                  {team.ties ? `–${team.ties}` : ''}
                </p>
                <p className="faceoff-score">{team.fraction}</p>
                <p className="faceoff-caption">
                  {team.fraction === 'Evens' ? 'Even money' : 'To win'} ·{' '}
                  {team.payout.toFixed(2)} pts return
                </p>
                <p className="mb-3 text-[11px] text-muted-foreground">
                  {team.total.toFixed(1)} projected ·{' '}
                  {Math.round(team.chance * 100)}% chance
                </p>
                {picked && result !== undefined && (
                  <Stamp
                    className="faceoff-stamp"
                    tone={result === 'tie' ? 'muted' : won ? 'win' : 'loss'}
                  >
                    {result === 'tie' ? 'Tied' : won ? 'Called it' : 'Missed'}
                  </Stamp>
                )}
                <button
                  type="button"
                  className="faceoff-pick"
                  aria-pressed={picked}
                  aria-label={`Pick ${team.name} at ${team.fraction}`}
                  disabled={result !== undefined}
                  onClick={() => onPick(team.id)}
                >
                  {picked && <Check className="size-4" aria-hidden="true" />}
                  {result !== undefined
                    ? result === 'tie'
                      ? 'Tied · 0 pts'
                      : won
                        ? picked
                          ? `Won · ${team.payout.toFixed(2)} pts`
                          : 'Winner'
                        : picked
                          ? 'Missed · 0 pts'
                          : 'Lost'
                    : picked
                      ? 'Picked'
                      : 'Pick'}
                  {result === undefined && (
                    <span className="ml-1 font-mono font-black">
                      {team.fraction}
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="faceoff-keys">
        {matchup.teams.map((team) => (
          <ul
            key={team.id}
            className="key-players"
            aria-label={`${team.name}’s key players`}
          >
            {[...(adjusted ? team.adjustedLineup : team.lineup)]
              .sort((a, b) => b.points - a.points)
              .slice(0, 3)
              .map((player) => (
                <li key={player.name}>
                  <span className="truncate">{player.name}</span>
                  <span className="font-mono text-muted-foreground">
                    {player.points.toFixed(1)}
                  </span>
                </li>
              ))}
          </ul>
        ))}
      </div>
      {feature && (
        <blockquote className="motw-quote">{feature.reason}</blockquote>
      )}
      {result !== undefined && (
        <label className="mx-3 mb-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          Try another result
          <select
            className="min-h-11 min-w-0 max-w-[65%] rounded-md border border-border bg-background px-2 text-foreground"
            aria-label={`Result for matchup ${matchup.id}`}
            value={result}
            onChange={(event) =>
              onResult(
                event.target.value === 'tie'
                  ? 'tie'
                  : Number(event.target.value),
              )
            }
          >
            {matchup.teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name} wins
              </option>
            ))}
            <option value="tie">Tie</option>
          </select>
        </label>
      )}
      <div className="faceoff-footer">
        <Drawer showSwipeHandle>
          <DrawerTrigger
            className="programme-trigger"
            aria-label={`Programme: ${home.name} v ${away.name}`}
          >
            <NotebookText className="size-4" aria-hidden="true" />
            Programme
          </DrawerTrigger>
          <DrawerContent className="sm:mx-auto sm:max-w-2xl">
            <DrawerHeader className="pb-3">
              <p className="ui-kicker">Match programme</p>
              <DrawerTitle className="text-xl font-bold tracking-tight">
                {home.name} v {away.name}
              </DrawerTitle>
              <DrawerDescription className="text-xs">
                {home.teamName} v {away.teamName}
              </DrawerDescription>
            </DrawerHeader>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <Tabs defaultValue="odds">
                <TabsList
                  aria-label="Programme sections"
                  className="programme-tabs"
                >
                  <TabsTrigger value="odds" className="min-h-10">
                    The odds
                  </TabsTrigger>
                  <TabsTrigger value="report" className="min-h-10">
                    Report
                  </TabsTrigger>
                  <TabsTrigger value="lineups" className="min-h-10">
                    Lineups
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="odds" className="space-y-4 pt-3">
                  <p className="text-sm leading-6">
                    A correct pick returns one point plus the fractional odds.{' '}
                    <strong>3/1 = 4 points; 1/2 = 1.5 points.</strong> Wrong or
                    tied picks return zero.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {matchup.teams.map((team) => (
                      <section
                        key={team.id}
                        className="rounded-lg border border-border p-3"
                      >
                        <p className="text-sm font-bold">
                          {team.name}{' '}
                          <span className="ml-2 font-mono text-primary">
                            {team.fraction}
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {team.payout.toFixed(2)} points for a correct call.
                          {team.banked > 0
                            ? ` ${team.banked.toFixed(1)} fantasy points already scored.`
                            : ''}
                        </p>
                        {adjusted && (
                          <ul className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">
                            {team.matchupNotes.map((note) => (
                              <li key={note}>{note}</li>
                            ))}
                          </ul>
                        )}
                      </section>
                    ))}
                  </div>
                  {missing.length > 0 && (
                    <p className="text-xs leading-5 text-muted-foreground">
                      {basis === 'best'
                        ? `Not playing this week: ${missing.join(', ')}. The odds assume the best lineup from the rest of the squad.`
                        : `Not playing this week: ${missing.join(', ')}. The odds assume the best bench option covers ${missing.length === 1 ? 'that slot' : 'those slots'}.`}
                    </p>
                  )}
                  <p className="text-xs leading-5 text-muted-foreground">
                    Week {week} snapshot · approximate prices, rounded to
                    familiar fractions.{' '}
                    {adjusted
                      ? 'Includes an experimental opponent adjustment.'
                      : 'Based on projected scoring margins.'}{' '}
                    These are MAC 12 trial odds, not a bookmaker feed.
                  </p>
                </TabsContent>
                <TabsContent value="report" className="space-y-4 pt-3">
                  {report ? (
                    <>
                      <h3 className="font-semibold">{report.headline}</h3>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {report.summary}
                      </p>
                      {report.sections.map((section) => (
                        <section key={section.title}>
                          <h4 className="text-sm font-semibold">
                            {section.title}
                          </h4>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {section.text}
                          </p>
                        </section>
                      ))}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No report in this snapshot.
                    </p>
                  )}
                </TabsContent>
                <TabsContent value="lineups" className="pt-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {matchup.teams.map((team) => (
                      <TrialLineup
                        key={team.id}
                        team={team}
                        adjusted={adjusted}
                        basis={basis}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    {basis === 'best'
                      ? 'Best legal projected lineups for this trial, including bench options.'
                      : 'Lineups as set, with the best bench player covering anyone not playing.'}{' '}
                    Completed starters keep their actual points.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </article>
  );
}

function TrialLineup({
  team,
  adjusted,
  basis,
}: {
  team: TrialTeam;
  adjusted: boolean;
  basis: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-muted/20 p-3">
      <div className="mb-2 flex items-center gap-2">
        <TeamAvatar
          avatar={team.avatar}
          name={team.teamName}
          className="size-7"
        />
        <p className="text-sm font-semibold">{team.teamName}</p>
      </div>
      {(adjusted ? team.adjustedLineup : team.lineup).map((player) => (
        <div
          key={player.name}
          className="grid grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-2 border-b border-border py-2.5 text-xs last:border-0"
        >
          <span className="font-mono text-primary">{player.position}</span>
          <span>
            {player.name}
            {player.fromBench && (
              <span className="block text-[10px] text-award">
                {basis === 'best' ? 'Bench option' : 'Covers a missing starter'}
              </span>
            )}
            {player.locked && (
              <span className="block text-[10px] text-primary">
                Already scored
              </span>
            )}
          </span>
          <span className="font-mono text-muted-foreground">
            {player.points.toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  );
}
