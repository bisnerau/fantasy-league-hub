'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowDown, Check, LockKeyhole, ReceiptText, X } from 'lucide-react';
import type { PredictionMatchup } from '@/lib/data/predictions';
import type { Slip, Verdict } from '@/lib/predictions/slip';
import type { LeaderboardRow } from './use-prediction-member';

export type SlipState =
  | 'signed-out'
  | 'loading'
  | 'open'
  | 'locked'
  | 'settled'
  | 'unavailable';

const verdictMark: Record<Verdict, string> = {
  won: '✓',
  lost: '✗',
  void: 'VOID',
};
const verdictWord: Record<Verdict, string> = {
  won: 'won',
  lost: 'lost',
  void: 'void, tied',
};

function ordinal(value: number) {
  const suffix =
    value % 100 >= 11 && value % 100 <= 13
      ? 'th'
      : (({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[
          value % 10
        ] ?? 'th');
  return `${value}${suffix}`;
}

/** The settled slip printed like a bookmaker's docket; no score figures. */
function Docket({
  slip,
  week,
  row,
  rows,
  onClose,
}: {
  slip: Slip;
  week: number;
  row?: LeaderboardRow;
  rows: LeaderboardRow[];
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus(), []);
  const rank = row
    ? rows.findIndex((candidate) => candidate.points === row.points) + 1
    : 0;
  return (
    <section id="bookie-docket" className="docket" aria-label="Your docket">
      <div className="docket-paper">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="docket-head">MAC 12 · WK {week}</p>
            <p className="docket-sub">
              {slip.selections.length}{' '}
              {slip.selections.length === 1 ? 'selection' : 'selections'}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="docket-close"
            onClick={onClose}
            aria-label="Tear off the docket"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <ol className="docket-lines">
          {slip.selections.map((selection) => (
            <li key={selection.matchupId}>
              <span className="min-w-0 truncate">
                {selection.team.ownerName}
                {selection.banker && (
                  <span className="docket-banker"> ★ Banker ×2</span>
                )}
              </span>
              <span
                className="docket-mark"
                data-verdict={selection.verdict ?? 'pending'}
              >
                <span aria-hidden="true">
                  {selection.verdict ? verdictMark[selection.verdict] : '—'}
                </span>
                <span className="sr-only">
                  {selection.verdict
                    ? verdictWord[selection.verdict]
                    : 'awaiting both scores'}
                </span>
              </span>
            </li>
          ))}
        </ol>
        {row ? (
          <p className="docket-total">
            <span>Returned {row.points} pts</span>
            <span>
              {ordinal(rank)} of {rows.length}
            </span>
          </p>
        ) : (
          <p className="docket-sub mt-3">
            The return appears once the week’s table is settled.
          </p>
        )}
      </div>
    </section>
  );
}

/** A betting-slip tray for the week's picks. The points are bragging points. */
export function BetSlip({
  slip,
  matchups,
  state,
  week,
  weeklyRows,
  userId,
  onJump,
  onSignIn,
}: {
  slip: Slip;
  matchups: PredictionMatchup[];
  state: SlipState;
  week: number;
  weeklyRows: LeaderboardRow[];
  userId?: string;
  onJump: (sleeperMatchupId: number) => void;
  onSignIn: () => void;
}) {
  const [docketOpen, setDocketOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const picked = new Map(
    slip.selections.map((selection) => [selection.sleeperMatchupId, selection]),
  );
  const complete = slip.selections.length === slip.total && slip.total > 0;
  const row = weeklyRows.find((candidate) => candidate.voter_id === userId);
  const meta =
    state === 'signed-out'
      ? 'Sign in to start your slip'
      : state === 'loading'
        ? 'Checking your slip…'
        : state === 'unavailable'
          ? 'Your slip is unavailable right now'
          : [
              `${slip.selections.length}/${slip.total} selections`,
              slip.banker
                ? `Banker: ${slip.banker.team.ownerName}`
                : state === 'open'
                  ? 'No Banker yet'
                  : null,
              state === 'open'
                ? `Returns up to ${slip.maxReturn} ${slip.maxReturn === 1 ? 'pt' : 'pts'}`
                : null,
            ]
              .filter(Boolean)
              .join(' · ');

  return (
    <aside className="bet-slip" aria-label="Your bet slip">
      {docketOpen && state === 'settled' && (
        <Docket
          slip={slip}
          week={week}
          row={row}
          rows={weeklyRows}
          onClose={() => {
            setDocketOpen(false);
            toggleRef.current?.focus();
          }}
        />
      )}
      <div className="bet-slip-bar" data-complete={complete || undefined}>
        <ol className="slip-dots" aria-hidden="true">
          {matchups.map((matchup) => {
            const selection = picked.get(matchup.sleeperMatchupId);
            return (
              <li
                key={matchup.sleeperMatchupId}
                data-picked={selection ? '' : undefined}
                data-banker={selection?.banker || undefined}
                data-verdict={selection?.verdict ?? undefined}
                style={
                  selection?.team.color
                    ? ({ '--dot': selection.team.color } as CSSProperties)
                    : undefined
                }
              />
            );
          })}
        </ol>
        <div className="min-w-0 flex-1">
          <p className="slip-title">
            {state === 'locked' ? (
              <>
                <LockKeyhole className="size-3.5" aria-hidden="true" /> Slip
                locked
              </>
            ) : complete && state === 'open' ? (
              <>
                <Check className="size-3.5" aria-hidden="true" /> Slip complete
              </>
            ) : (
              'Your slip'
            )}
          </p>
          <p className="slip-meta">{meta}</p>
        </div>
        {state === 'signed-out' ? (
          <button type="button" className="slip-action" onClick={onSignIn}>
            Start your slip
          </button>
        ) : state === 'open' && slip.nextOpen != null ? (
          <button
            type="button"
            className="slip-action"
            onClick={() => onJump(slip.nextOpen!)}
          >
            Next pick <ArrowDown className="size-4" aria-hidden="true" />
          </button>
        ) : state === 'settled' && slip.selections.length > 0 ? (
          <button
            ref={toggleRef}
            type="button"
            className="slip-action"
            aria-expanded={docketOpen}
            aria-controls={docketOpen ? 'bookie-docket' : undefined}
            onClick={() => setDocketOpen((open) => !open)}
          >
            <ReceiptText className="size-4" aria-hidden="true" />
            {docketOpen ? 'Hide docket' : 'See your docket'}
          </button>
        ) : null}
      </div>
    </aside>
  );
}
