'use client';

import { useEffect, useRef, useState } from 'react';
import { ReceiptText, X } from 'lucide-react';
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

type PanelMode = 'open' | 'locked' | 'settled';

/**
 * The slip printed like a bookmaker's docket. During the week it lists every
 * matchup and each line jumps to its card; once settled it shows the results.
 * It never prints score figures.
 */
function Docket({
  mode,
  slip,
  matchups,
  week,
  row,
  rows,
  onJump,
  onClose,
}: {
  mode: PanelMode;
  slip: Slip;
  matchups: PredictionMatchup[];
  week: number;
  row?: LeaderboardRow;
  rows: LeaderboardRow[];
  onJump: (sleeperMatchupId: number) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus(), []);
  const settled = mode === 'settled';
  const rank = row
    ? rows.findIndex((candidate) => candidate.points === row.points) + 1
    : 0;
  const picked = new Map(
    slip.selections.map((selection) => [selection.sleeperMatchupId, selection]),
  );
  return (
    <section
      id="bookie-docket"
      className="docket"
      aria-label={settled ? 'Your docket' : 'Your slip'}
    >
      <div className="docket-paper">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="docket-head">
              {settled ? 'MAC 12' : 'Your slip'} · WK {week}
            </p>
            <p className="docket-sub">
              {slip.selections.length}{' '}
              {slip.selections.length === 1 ? 'selection' : 'selections'}
              {mode === 'open' && ` of ${slip.total}`}
              {mode === 'locked' && ' · locked'}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="docket-close"
            onClick={onClose}
            aria-label={settled ? 'Tear off the docket' : 'Close your slip'}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        {mode === 'open' ? (
          <ol className="docket-lines">
            {matchups.map((matchup) => {
              const selection = picked.get(matchup.sleeperMatchupId);
              const fixture = `${matchup.home.ownerName} v ${matchup.away.ownerName}`;
              return (
                <li key={matchup.sleeperMatchupId} className="docket-line-open">
                  <button
                    type="button"
                    className="docket-line-button"
                    aria-label={
                      selection
                        ? `${selection.team.ownerName}${selection.banker ? ', Banker' : ''}. Change your pick in ${fixture}`
                        : `No pick yet. Pick ${fixture}`
                    }
                    onClick={() => onJump(matchup.sleeperMatchupId)}
                  >
                    <span className="min-w-0">
                      <span
                        className={
                          selection
                            ? 'block truncate'
                            : 'block truncate opacity-60'
                        }
                      >
                        {selection ? selection.team.ownerName : 'No pick yet'}
                        {selection?.banker && (
                          <span className="docket-banker"> ★ Banker ×2</span>
                        )}
                      </span>
                      <span className="block truncate text-[10px] opacity-60">
                        {fixture}
                      </span>
                    </span>
                    <span className="docket-jump">
                      {selection ? 'Change' : 'Pick'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        ) : (
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
                    {selection.verdict
                      ? verdictMark[selection.verdict]
                      : settled
                        ? '—'
                        : 'LOCKED'}
                  </span>
                  <span className="sr-only">
                    {selection.verdict
                      ? verdictWord[selection.verdict]
                      : settled
                        ? 'awaiting both scores'
                        : 'locked, awaiting results'}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        )}
        {mode === 'open' ? (
          <p className="docket-total">
            <span>
              Returns up to {slip.maxReturn}{' '}
              {slip.maxReturn === 1 ? 'pt' : 'pts'}
            </span>
            <span>{slip.banker ? '★ Banked' : 'No Banker'}</span>
          </p>
        ) : settled && row ? (
          <p className="docket-total">
            <span>Returned {row.points} pts</span>
            <span>
              {ordinal(rank)} of {rows.length}
            </span>
          </p>
        ) : (
          <p className="docket-sub mt-3">
            {settled
              ? 'The return appears once the week’s table is settled.'
              : 'Results are graded after Tuesday’s settlement.'}
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
  const panelMode: PanelMode | null =
    state === 'open' || state === 'locked' || state === 'settled'
      ? state
      : null;
  const canOpen =
    panelMode === 'open'
      ? slip.total > 0
      : panelMode != null && slip.selections.length > 0;
  const toggle = () => setDocketOpen((open) => !open);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const row = weeklyRows.find((candidate) => candidate.voter_id === userId);
  const rank = row
    ? weeklyRows.findIndex((candidate) => candidate.points === row.points) + 1
    : 0;
  const count = `${slip.selections.length}/${slip.total} picks saved`;
  const banker = slip.banker
    ? `Banker: ${slip.banker.team.ownerName}`
    : state === 'open'
      ? 'No Banker yet'
      : 'No Banker';
  const [headline, detail] =
    state === 'signed-out'
      ? ['Your slip', 'Sign in to start your slip']
      : state === 'loading'
        ? ['Your slip', 'Checking your slip…']
        : state === 'unavailable'
          ? ['Your slip', 'Your slip is unavailable right now']
          : state === 'settled' && row
            ? [
                `Returned ${row.points} pts · ${ordinal(rank)} of ${weeklyRows.length}`,
                banker,
              ]
            : [state === 'locked' ? `${count} · locked` : count, banker];

  return (
    <aside className="bet-slip" aria-label="Your bet slip">
      {docketOpen && panelMode && canOpen && (
        <Docket
          mode={panelMode}
          slip={slip}
          matchups={matchups}
          week={week}
          row={row}
          rows={weeklyRows}
          onJump={(id) => {
            setDocketOpen(false);
            onJump(id);
          }}
          onClose={() => {
            setDocketOpen(false);
            toggleRef.current?.focus();
          }}
        />
      )}
      <div className="bet-slip-bar">
        <div className="slip-text">
          <p className="slip-title">{headline}</p>
          <p className="slip-meta">{detail}</p>
        </div>
        {state === 'signed-out' ? (
          <button type="button" className="slip-action" onClick={onSignIn}>
            Start your slip
          </button>
        ) : canOpen ? (
          <button
            ref={toggleRef}
            type="button"
            className="slip-action"
            aria-expanded={docketOpen}
            aria-controls={docketOpen ? 'bookie-docket' : undefined}
            onClick={toggle}
          >
            <ReceiptText className="size-4" aria-hidden="true" />
            {state === 'settled'
              ? docketOpen
                ? 'Hide docket'
                : 'See your docket'
              : docketOpen
                ? 'Hide slip'
                : 'View slip'}
          </button>
        ) : null}
      </div>
    </aside>
  );
}
