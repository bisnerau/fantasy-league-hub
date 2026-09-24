'use client';

import type { KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, Zap } from 'lucide-react';
import { SwipePick, type SwipeSide } from '@/components/effects/swipe-pick';
import { TeamAvatar } from '@/components/shared/team-avatar';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import type { PredictionMatchup } from '@/lib/data/predictions';
import { getLine } from '@/lib/predictions/line';
import { formatScore } from '@/lib/sleeper/scores';

/**
 * A rapid-fire ballot: one unpicked matchup at a time, swiped towards a team
 * or picked with the buttons and arrow keys. A card only leaves the deck once
 * its pick is verified as saved, because the deck is the unpicked matchups.
 */
export function QuickPick({
  matchups,
  pickedIds,
  pending,
  feedback,
  disabled,
  onPick,
}: {
  matchups: PredictionMatchup[];
  pickedIds: Set<number>;
  pending: Record<number, number>;
  feedback: Record<number, { text: string; error: boolean }>;
  disabled: boolean;
  onPick: (matchup: PredictionMatchup, rosterId: number) => void;
}) {
  const open = matchups.filter(
    (matchup) =>
      matchup.databaseId != null && !pickedIds.has(matchup.databaseId),
  );
  const current = open[0];
  const saving = current ? pending[current.databaseId!] : undefined;
  const note = current ? feedback[current.databaseId!] : undefined;
  const choose = (side: SwipeSide) => {
    if (!current || disabled || saving != null) return;
    onPick(current, current[side].rosterId);
  };
  const arrows = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') choose('home');
    if (event.key === 'ArrowRight') choose('away');
  };
  const line = current ? getLine(current) : null;

  return (
    <Drawer>
      <DrawerTrigger className="rapid-trigger" disabled={disabled}>
        <Zap className="size-4" aria-hidden="true" /> Rapid-fire slip
      </DrawerTrigger>
      <DrawerContent className="sm:mx-auto sm:max-w-md">
        <DrawerHeader className="pb-3">
          <p className="ui-kicker">Rapid-fire slip</p>
          <DrawerTitle className="text-xl font-bold tracking-tight">
            {current
              ? `${open.length} ${open.length === 1 ? 'pick' : 'picks'} to go`
              : 'Slip complete'}
          </DrawerTitle>
          <DrawerDescription className="text-xs">
            Swipe towards a team, tap a button, or use the arrow keys.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
          {current ? (
            <>
              <div className="quick-stack" data-left={Math.min(open.length, 3)}>
                <SwipePick
                  key={current.sleeperMatchupId}
                  disabled={disabled || saving != null}
                  onPick={choose}
                >
                  <p className="text-center font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    Matchup {current.sleeperMatchupId}
                    {line && ` · Line ${line.label}`}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {(['home', 'away'] as const).map((side) => {
                      const team = current[side];
                      return (
                        <div key={side} className="quick-team" data-side={side}>
                          <TeamAvatar
                            avatar={team.avatar}
                            name={team.teamName}
                            className="size-14"
                          />
                          <p className="mt-2 text-base font-bold leading-tight">
                            {team.ownerName}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {team.teamName}
                          </p>
                          <p className="mt-2 font-mono text-lg font-bold">
                            {formatScore(team.projectedScore, 1)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </SwipePick>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {(['home', 'away'] as const).map((side) => {
                  const team = current[side];
                  const busy = saving === team.rosterId;
                  return (
                    <button
                      key={side}
                      type="button"
                      className="quick-choice"
                      aria-label={`Pick ${team.teamName}`}
                      aria-busy={busy}
                      disabled={disabled || saving != null}
                      onClick={() => choose(side)}
                      onKeyDown={arrows}
                    >
                      {side === 'home' && !busy && (
                        <ArrowLeft className="size-4" aria-hidden="true" />
                      )}
                      {busy ? 'Saving…' : team.ownerName}
                      {side === 'away' && !busy && (
                        <ArrowRight className="size-4" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
              {note && (
                <p
                  role={note.error ? 'alert' : 'status'}
                  className={
                    note.error
                      ? 'mt-3 text-sm text-destructive'
                      : 'mt-3 text-sm text-primary'
                  }
                >
                  {note.text}
                </p>
              )}
            </>
          ) : (
            <div className="py-6 text-center">
              <Check
                className="mx-auto size-8 text-primary"
                aria-hidden="true"
              />
              <p className="mt-3 text-sm text-muted-foreground">
                Every matchup has a saved pick. Hold one to bank it ×2.
              </p>
              <DrawerClose className="slip-action mx-auto mt-5">
                Back to the slip
              </DrawerClose>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
