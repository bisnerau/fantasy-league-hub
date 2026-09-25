'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowDown,
  Check,
  ChevronUp,
  LockKeyhole,
  ReceiptText,
  X,
} from 'lucide-react';
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
  const picked = new Map(
    slip.selections.map((selection) => [selection.sleeperMatchupId, selection]),
  );
  const complete = slip.selections.length === slip.total && slip.total > 0;
  const row = weeklyRows.find((candidate) => candidate.voter_id === userId);
  const firstName = (name: string) => name.split(' ')[0];
  const bankerText = slip.banker
    ? `Banker: ${firstName(slip.banker.team.ownerName)}`
    : 'No Banker yet';
  const nextPick = state === 'open' && slip.nextOpen != null;
  const rank = row
    ? weeklyRows.findIndex((candidate) => candidate.points === row.points) + 1
    : 0;
  const meta =
    state === 'signed-out'
      ? 'Sign in to start your slip'
      : state === 'loading'
        ? 'Checking your slip…'
        : state === 'unavailable'
          ? 'Your slip is unavailable right now'
          : state === 'settled'
            ? row
              ? `Returned ${row.points} pts · ${ordinal(rank)} of ${weeklyRows.length}`
              : `${slip.selections.length} ${slip.selections.length === 1 ? 'selection' : 'selections'}`
            : state === 'locked'
              ? `${slip.selections.length}/${slip.total} picked · ${bankerText}`
              : complete
                ? `${bankerText} · up to ${slip.maxReturn} pts`
                : `${slip.selections.length}/${slip.total} picked · ${bankerText}`;

  const title =
    state === 'settled' ? (
      'Your docket'
    ) : state === 'locked' ? (
      <>
        <LockKeyhole className="size-3.5" aria-hidden="true" /> Slip locked
      </>
    ) : complete && state === 'open' ? (
      <>
        <Check className="size-3.5" aria-hidden="true" /> Slip complete
      </>
    ) : (
      'Your slip'
    );
  const summary = (
    <>
      <span className="slip-text">
        <span className="slip-title">
          {title}
          {canOpen && nextPick && (
            <ChevronUp className="slip-chevron size-3.5" aria-hidden="true" />
          )}
        </span>
        <span className="slip-meta">{meta}</span>
      </span>
      {canOpen && !nextPick && (
        <span className="slip-cue" aria-hidden="true">
          <ReceiptText className="size-4" />
          <ChevronUp className="slip-chevron size-4" />
        </span>
      )}
    </>
  );

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
        {canOpen ? (
          <button
            ref={toggleRef}
            type="button"
            className="slip-summary"
            aria-expanded={docketOpen}
            aria-controls={docketOpen ? 'bookie-docket' : undefined}
            onClick={toggle}
          >
            {summary}
          </button>
        ) : (
          <div className="slip-summary">{summary}</div>
        )}
        {state === 'signed-out' ? (
          <button type="button" className="slip-action" onClick={onSignIn}>
            Start your slip
          </button>
        ) : nextPick ? (
          <button
            type="button"
            className="slip-action"
            onClick={() => onJump(slip.nextOpen!)}
          >
            Next pick <ArrowDown className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </aside>
  );
}
