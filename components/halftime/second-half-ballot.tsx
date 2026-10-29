'use client';

import { useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import {
  AnimatePresence,
  MotionConfig,
  Reorder,
  motion,
  useDragControls,
  useReducedMotionConfig,
} from 'motion/react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  GripVertical,
  Toilet,
  Trophy,
} from 'lucide-react';
import type { HalftimeTeam } from '@/lib/data/halftime/report';
import type { houseBallot } from '@/lib/data/halftime/house-ballot';
import { formatLockTime } from '@/lib/predictions/rules';
import {
  bracketGames,
  changeOfHeart,
  championOf,
  halftimeBallotSummary,
  lastStandingOf,
  spoonOf,
  validPicks,
  type BracketGame,
  type BracketKind,
  type HalftimeBallot,
} from '@/lib/season/halftime-ballot';
import type { useSecondHalfBallot } from './use-second-half-ballot';
import { useHalftimeReducedMotion } from './use-reduced-motion';

type Ballot = ReturnType<typeof useSecondHalfBallot>;
type House = typeof houseBallot;
type Picks = (number | null)[];
const steps = ['Table', 'Championship', 'Loser bowl', 'Review'] as const;
const noPicks: Picks = [null, null, null, null, null];
const ease = [0.22, 1, 0.36, 1] as const;

function Spoon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="ht-spoon"
    >
      <ellipse cx="8" cy="8" rx="5" ry="6.5" transform="rotate(-45 8 8)" />
      <path d="M11.5 11.5 21 21" />
    </svg>
  );
}

function TeamName({ team, seed }: { team: HalftimeTeam; seed?: number }) {
  return (
    <>
      {seed !== undefined && <span className="ht-ballot-seed">{seed}</span>}
      <span className="ht-portrait">
        <Image src={team.avatar} alt="" width={65} height={65} unoptimized />
      </span>
      <span className="ht-ballot-name">
        <strong>{team.team}</strong>
        <small>{team.name}</small>
      </span>
    </>
  );
}

function TableRow({
  team,
  index,
  count,
  move,
}: {
  team: HalftimeTeam;
  index: number;
  count: number;
  move: (from: number, to: number) => void;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={team.id}
      dragListener={false}
      dragControls={controls}
      className={`ht-ballot-row ${index === 5 ? 'ht-ballot-cut' : ''}`}
      whileDrag={{ scale: 1.02, boxShadow: '0 14px 30px #0009', zIndex: 5 }}
      transition={{ duration: 0.25, ease }}
    >
      <span
        className="ht-ballot-grip"
        onPointerDown={(e) => controls.start(e)}
        aria-hidden="true"
      >
        <GripVertical size={18} />
      </span>
      <TeamName team={team} seed={index + 1} />
      {index === count - 1 && (
        <span className="ht-ballot-punish">
          <Spoon size={14} /> Punishment
        </span>
      )}
      <span className="ht-ballot-nudge">
        <button
          type="button"
          data-nudge={`${team.id}-up`}
          disabled={index === 0}
          onClick={() => move(index, index - 1)}
          aria-label={`Move ${team.team} up to ${index}`}
        >
          <ArrowUp size={16} />
        </button>
        <button
          type="button"
          data-nudge={`${team.id}-down`}
          disabled={index === count - 1}
          onClick={() => move(index, index + 1)}
          aria-label={`Move ${team.team} down to ${index + 2}`}
        >
          <ArrowDown size={16} />
        </button>
      </span>
    </Reorder.Item>
  );
}

function BracketSlot({
  team,
  seed,
  game,
  loser,
  onPick,
}: {
  team: HalftimeTeam;
  seed: number;
  game: BracketGame;
  loser: boolean;
  onPick?: (game: BracketGame, rosterId: number) => void;
}) {
  const picked = game.pick === team.id;
  return (
    <motion.button
      type="button"
      className="ht-bk-slot"
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: game.pick === null || picked ? 1 : 0.4, x: 0 }}
      transition={{ duration: 0.32, ease }}
      aria-pressed={picked}
      disabled={!onPick}
      onClick={() => onPick?.(game, team.id)}
      aria-label={`${team.team}${loser ? ' loses and goes through' : ' wins'}`}
    >
      <span className="ht-ballot-seed">{seed}</span>
      <span className="ht-portrait">
        <Image src={team.avatar} alt="" width={65} height={65} unoptimized />
      </span>
      <span className="ht-ballot-name">
        <strong>{team.team}</strong>
        <small>{team.name}</small>
      </span>
      {picked && (
        <motion.span
          className="ht-bk-tick"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.45 }}
        >
          <Check size={12} strokeWidth={3} />
        </motion.span>
      )}
    </motion.button>
  );
}

// A classic bracket: Week 15, Week 16 and the final side by side, joined by
// lines that light up as each game is decided. Phones scroll it sideways and
// move on to the next round once a round is complete.
function Bracket({
  kind,
  rankings,
  picks,
  teams,
  onPick,
}: {
  kind: BracketKind;
  rankings: number[];
  picks: Picks;
  teams: Map<number, HalftimeTeam>;
  onPick?: (index: number, rosterId: number) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const still = useReducedMotionConfig();
  const games = bracketGames(rankings, picks, kind);
  const loser = kind === 'loserBowl';
  const seedOf = (id: number) => rankings.indexOf(id) + 1;
  const result = games[4].pick === null ? null : teams.get(games[4].pick);
  const verb = loser ? 'Loser' : 'Winner';
  const waiting = (game: BracketGame) =>
    game.round === 2
      ? `${verb} of ${games[game.index - 2].teams
          .map((id) => (id === null ? '?' : seedOf(id)))
          .join(' v ')}`
      : `Week 16 ${verb.toLowerCase()}`;

  function pick(game: BracketGame, rosterId: number) {
    onPick?.(game.index, rosterId);
    const roundDone = games
      .filter((g) => g.round === game.round)
      .every((g) => g.index === game.index || g.pick !== null);
    if (!roundDone || game.round === 3) return;
    window.requestAnimationFrame(() => {
      const box = scroller.current;
      const next = box?.querySelector<HTMLElement>(
        `[data-round="${game.round + 1}"]`,
      );
      if (box && next && box.scrollWidth > box.clientWidth)
        box.scrollTo({
          left: next.offsetLeft - 12,
          behavior: still ? 'auto' : 'smooth',
        });
    });
  }
  const cell = (game: BracketGame, column: number, row: string) => (
    <div
      className="ht-bk-game"
      key={game.index}
      data-round={game.round}
      style={{ gridColumn: column, gridRow: row }}
    >
      {game.teams.map((id, side) => {
        const team = id === null ? undefined : teams.get(id);
        return team ? (
          <BracketSlot
            key={team.id}
            team={team}
            seed={seedOf(team.id)}
            game={game}
            loser={loser}
            onPick={onPick ? pick : undefined}
          />
        ) : (
          <span className="ht-bk-waiting" key={`wait-${side}`}>
            {waiting(game)}
          </span>
        );
      })}
    </div>
  );
  const lit = (on: boolean) => (on ? 'ht-bk-lit' : '');

  return (
    <div className={`ht-bracket ${loser ? 'ht-bracket-loser' : ''}`}>
      <div className="ht-bk-scroll" ref={scroller}>
        <div className="ht-bk-grid">
          <span className="ht-bk-head" style={{ gridColumn: 1 }}>
            Week 15
          </span>
          <span className="ht-bk-head" style={{ gridColumn: 3 }}>
            Week 16
          </span>
          <span className="ht-bk-head" style={{ gridColumn: 5 }}>
            Week 17 · Final
          </span>
          <span className="ht-bk-head" style={{ gridColumn: 7 }}>
            {loser ? 'Last one standing' : 'Champion'}
          </span>
          {cell(games[0], 1, '2')}
          {cell(games[1], 1, '3')}
          <i
            className={`ht-bk-link ${lit(games[0].pick !== null)}`}
            style={{ gridColumn: 2, gridRow: '2' }}
          />
          <i
            className={`ht-bk-link ${lit(games[1].pick !== null)}`}
            style={{ gridColumn: 2, gridRow: '3' }}
          />
          {cell(games[2], 3, '2')}
          {cell(games[3], 3, '3')}
          <i
            className={`ht-bk-elbow ht-bk-elbow-top ${lit(games[2].pick !== null)}`}
            style={{ gridColumn: 4, gridRow: '2' }}
          />
          <i
            className={`ht-bk-elbow ht-bk-elbow-bottom ${lit(games[3].pick !== null)}`}
            style={{ gridColumn: 4, gridRow: '3' }}
          />
          {cell(games[4], 5, '2 / 4')}
          <i
            className={`ht-bk-link ${lit(games[4].pick !== null)}`}
            style={{ gridColumn: 6, gridRow: '2 / 4' }}
          />
          <div
            className="ht-bk-result"
            style={{ gridColumn: 7, gridRow: '2 / 4' }}
            data-filled={Boolean(result)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={result?.id ?? 'empty'}
                className="ht-bk-prize"
                initial={
                  loser ? { y: -40, opacity: 0 } : { scale: 0.4, opacity: 0 }
                }
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
              >
                {loser ? <Toilet size={26} /> : <Trophy size={26} />}
              </motion.span>
            </AnimatePresence>
            <strong>{result ? result.team : '?'}</strong>
            {result && <small>{result.name}</small>}
          </div>
        </div>
      </div>
      {onPick && (
        <p className="ht-bk-hint">Swipe along to follow the bracket.</p>
      )}
    </div>
  );
}

function Summary({
  ballot,
  teams,
  children,
}: {
  ballot: HalftimeBallot;
  teams: Map<number, HalftimeTeam>;
  children?: ReactNode;
}) {
  const champion = teams.get(championOf(ballot))!;
  const spoon = teams.get(spoonOf(ballot))!;
  const lastStanding = teams.get(lastStandingOf(ballot))!;
  return (
    <div className="ht-ballot-summary">
      <div className="ht-ballot-outcomes">
        <div>
          <Trophy size={22} />
          <small>Champion</small>
          <strong>{champion.team}</strong>
        </div>
        <div className="ht-ballot-outcome-spoon">
          <Spoon />
          <small>Punishment · 12th</small>
          <strong>{spoon.team}</strong>
        </div>
      </div>
      <p className="ht-ballot-standing">
        <Toilet size={15} /> Loser bowl, last one standing:{' '}
        <strong>{lastStanding.team}</strong>
      </p>
      <ol className="ht-ballot-mini">
        {ballot.rankings.map((id, i) => (
          <li key={id} className={i === 5 ? 'ht-ballot-cut' : ''}>
            <span>{i + 1}</span>
            {teams.get(id)!.team}
            {i === 11 && <Spoon size={14} />}
          </li>
        ))}
      </ol>
      {children}
    </div>
  );
}

function Builder({
  teams,
  start,
  onSave,
  onCancel,
}: {
  teams: HalftimeTeam[];
  start: HalftimeBallot | null;
  onSave: (ballot: HalftimeBallot) => Promise<string>;
  onCancel?: () => void;
}) {
  const byId = new Map(teams.map((t) => [t.id, t]));
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [rankings, setRankings] = useState(
    () => start?.rankings ?? teams.map((t) => t.id),
  );
  const [championship, setChampionship] = useState<Picks>(
    () => start?.championship ?? noPicks,
  );
  const [loserBowl, setLoserBowl] = useState<Picks>(
    () => start?.loserBowl ?? noPicks,
  );
  const [saving, setSaving] = useState<string | null>(null);
  const filled = (p: Picks) => p.filter((x) => x !== null).length;
  // Picks are kept as made and checked against the current table, so dragging
  // a team out of the top six and back loses nothing. They are only trimmed
  // when the manager leaves the table step.
  const champ = validPicks(rankings, championship, 'championship');
  const loser = validPicks(rankings, loserBowl, 'loserBowl');
  const lost =
    filled(championship) - filled(champ) + filled(loserBowl) - filled(loser);
  const champDone = filled(champ) === 5;
  const loserDone = filled(loser) === 5;

  function move(from: number, to: number) {
    const id = rankings[from];
    const next = [...rankings];
    [next[from], next[to]] = [next[to], next[from]];
    setRankings(next);
    // Keep keyboard focus on the team that moved, even at the ends.
    const way = to < from ? 'up' : 'down';
    window.requestAnimationFrame(() =>
      (
        document.querySelector<HTMLElement>(
          `[data-nudge="${id}-${way}"]:not(:disabled)`,
        ) ??
        document.querySelector<HTMLElement>(
          `[data-nudge="${id}-${way === 'up' ? 'down' : 'up'}"]`,
        )
      )?.focus(),
    );
  }
  function go(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    setChampionship(champ);
    setLoserBowl(loser);
  }
  const pick =
    (kind: BracketKind, picks: Picks, set: (p: Picks) => void) =>
    (index: number, rosterId: number) => {
      const next = [...picks];
      next[index] = rosterId;
      set(validPicks(rankings, next, kind));
    };
  async function file() {
    setSaving('saving');
    const result = await onSave({
      rankings,
      championship: champ as number[],
      loserBowl: loser as number[],
    });
    // 'stale' means a different user signed in mid-save; nothing to report.
    setSaving(result === 'saved' || result === 'stale' ? null : result);
  }
  const reachable = [true, true, true, champDone && loserDone];

  return (
    <div className="ht-ballot-builder">
      <nav className="ht-ballot-rail" aria-label="Ballot steps">
        {steps.map((label, i) => (
          <button
            type="button"
            key={label}
            disabled={!reachable[i]}
            aria-current={step === i ? 'step' : undefined}
            onClick={() => go(i)}
          >
            {label}
            {i === 1 && champDone && <Check size={12} />}
            {i === 2 && loserDone && <Check size={12} />}
            {step === i && (
              <motion.i layoutId="ht-ballot-rail" transition={{ ease }} />
            )}
          </button>
        ))}
      </nav>
      {/* The next step slides in from the side it lives on; the previous
          step leaves at once so a dropped frame never holds up the switch. */}
      <motion.div
        key={step}
        className="ht-ballot-step"
        initial={{ opacity: 0, x: 32 * direction }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease }}
      >
        {step === 0 && (
          <>
            <h3>How will the table finish?</h3>
            <p>
              Drag or nudge teams into your Week 14 order. The top six make the
              playoffs; last place takes the punishment.
            </p>
            <Reorder.Group
              axis="y"
              values={rankings}
              onReorder={setRankings}
              className="ht-ballot-table"
            >
              {rankings.map((id, i) => (
                <TableRow
                  key={id}
                  team={byId.get(id)!}
                  index={i}
                  count={rankings.length}
                  move={move}
                />
              ))}
            </Reorder.Group>
            {lost > 0 && (
              <output className="ht-ballot-note">
                This order changes the seeds and clears {lost} bracket{' '}
                {lost === 1 ? 'pick' : 'picks'}.
              </output>
            )}
            <button
              type="button"
              className="ht-ballot-next"
              onClick={() => go(1)}
            >
              Pick the playoffs
            </button>
          </>
        )}
        {step === 1 && (
          <>
            <h3>Pick every playoff game.</h3>
            <p>
              Seeds come from your table and the top two skip Week 15. Tap the
              winner of each game.
            </p>
            <Bracket
              kind="championship"
              rankings={rankings}
              picks={champ}
              teams={byId}
              onPick={pick('championship', champ, setChampionship)}
            />
            <button
              type="button"
              className="ht-ballot-next"
              disabled={!champDone}
              onClick={() => go(2)}
            >
              {champDone
                ? 'On to the loser bowl'
                : `${5 - filled(champ)} games to pick`}
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <h3>Now the loser bowl.</h3>
            <p>
              Seeds 7 to 12, and losers go through. Tap the team that loses each
              game.
            </p>
            <Bracket
              kind="loserBowl"
              rankings={rankings}
              picks={loser}
              teams={byId}
              onPick={pick('loserBowl', loser, setLoserBowl)}
            />
            <button
              type="button"
              className="ht-ballot-next"
              disabled={!loserDone}
              onClick={() => go(3)}
            >
              {loserDone
                ? 'Review my ballot'
                : `${5 - filled(loser)} games to pick`}
            </button>
          </>
        )}
        {step === 3 && champDone && loserDone && (
          <>
            <h3>Your second half.</h3>
            <p>Private until the lock. You can change it until then.</p>
            <Summary
              ballot={{
                rankings,
                championship: champ as number[],
                loserBowl: loser as number[],
              }}
              teams={byId}
            />
            <button
              type="button"
              className="ht-ballot-next"
              disabled={saving === 'saving'}
              onClick={file}
            >
              {saving === 'saving' ? 'Filing…' : 'File my ballot'}
            </button>
            {saving && saving !== 'saving' && (
              <p className="ht-ballot-note" role="alert">
                {saving === 'locked'
                  ? 'Ballots have locked. Yours was not saved.'
                  : 'Your ballot was not saved. Check your connection and try again.'}
              </p>
            )}
          </>
        )}
      </motion.div>
      {(step > 0 || onCancel) && (
        <div className="ht-ballot-back">
          {step > 0 && (
            <button type="button" onClick={() => go(step - 1)}>
              <ArrowLeft size={14} /> Back
            </button>
          )}
          {onCancel && (
            <button type="button" onClick={onCancel}>
              Keep my filed ballot
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Votes({
  title,
  rows,
  total,
  teams,
  icon,
}: {
  title: string;
  rows: { rosterId: number; voters: string[] }[];
  total: number;
  teams: Map<number, HalftimeTeam>;
  icon: ReactNode;
}) {
  return (
    <div className="ht-ballot-votes">
      <h4>
        {icon} {title}
      </h4>
      {rows.map((row, i) => (
        <div key={row.rosterId}>
          <span>{teams.get(row.rosterId)?.team}</span>
          <b>{row.voters.length}</b>
          <motion.i
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: row.voters.length / total }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.08, ease }}
          />
        </div>
      ))}
    </div>
  );
}

function HouseBallot({
  house,
  teams,
}: {
  house: House;
  teams: Map<number, HalftimeTeam>;
}) {
  return (
    <div className="ht-ballot-house">
      <h4>Mackorcle’s ballot</h4>
      <blockquote className="ht-stage-quote">
        <cite>MACKORCLE</cite>
        <p>“{house.lines.table}”</p>
      </blockquote>
      <Summary ballot={house} teams={teams}>
        <p className="ht-ballot-house-lines">
          <span>“{house.lines.champion}”</span>
          <span>“{house.lines.punishment}”</span>
        </p>
      </Summary>
    </div>
  );
}

function Revealed({
  ballots,
  house,
  teams,
}: {
  ballots: Ballot['revealed'];
  house: House;
  teams: HalftimeTeam[];
}) {
  const byId = new Map(teams.map((t) => [t.id, t]));
  const ids = teams.map((t) => t.id);
  const summary = halftimeBallotSummary(ballots, ids);
  const [open, setOpen] = useState<string | null>(null);
  if (!summary.count)
    return (
      <p className="ht-ballot-empty">
        No complete ballots were filed before the lock.
      </p>
    );
  return (
    <div className="ht-ballot-revealed">
      <div className="ht-ballot-room">
        <Votes
          title="The room’s champion"
          rows={summary.champions}
          total={summary.count}
          teams={byId}
          icon={<Trophy size={16} />}
        />
        <Votes
          title="The room’s punishment"
          rows={summary.spoons}
          total={summary.count}
          teams={byId}
          icon={<Spoon size={16} />}
        />
      </div>
      <div className="ht-ballot-consensus">
        <h4>The room’s final table</h4>
        <ol className="ht-ballot-mini">
          {summary.consensus.map((row, i) => (
            <li key={row.rosterId} className={i === 5 ? 'ht-ballot-cut' : ''}>
              <span>{i + 1}</span>
              {byId.get(row.rosterId)?.team}
              <small>{row.averagePosition.toFixed(1)} avg</small>
            </li>
          ))}
        </ol>
      </div>
      <HouseBallot house={house} teams={byId} />
      <div className="ht-ballot-managers">
        <h4>Every manager’s call · {summary.count} filed</h4>
        {ballots.map((b) => {
          const shift = b.preseason
            ? changeOfHeart(b.preseason, b.rankings)
            : null;
          const expanded = open === b.voter_id;
          return (
            <div key={b.voter_id} className="ht-ballot-manager">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? null : b.voter_id)}
              >
                <strong>{b.name}</strong>
                <span>
                  <Trophy size={13} /> {byId.get(championOf(b))?.team}
                </span>
                <span>
                  <Spoon size={13} /> {byId.get(spoonOf(b))?.team}
                </span>
                <b>{expanded ? '−' : '+'}</b>
              </button>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease }}
                  >
                    {shift && (
                      <p className="ht-ballot-shift">
                        Change of heart:{' '}
                        <strong>{byId.get(shift.rosterId)?.team}</strong> from{' '}
                        {shift.from} in September to {shift.to} now.
                      </p>
                    )}
                    <h5 className="ht-ballot-bracket-label">Championship</h5>
                    <Bracket
                      kind="championship"
                      rankings={b.rankings}
                      picks={b.championship}
                      teams={byId}
                    />
                    <h5 className="ht-ballot-bracket-label">Loser bowl</h5>
                    <Bracket
                      kind="loserBowl"
                      rankings={b.rankings}
                      picks={b.loserBowl}
                      teams={byId}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SecondHalfBallot({
  teams,
  ballot,
  house,
  lockAt,
  paused,
}: {
  teams: HalftimeTeam[];
  ballot: Ballot;
  house: House;
  lockAt: string;
  paused: boolean;
}) {
  const reduce = useHalftimeReducedMotion();
  const [editing, setEditing] = useState(false);
  const [stamp, setStamp] = useState(false);
  const byId = new Map(teams.map((t) => [t.id, t]));
  const lockText = formatLockTime(lockAt);

  async function save(next: HalftimeBallot) {
    const result = await ballot.save(next);
    if (result === 'saved') {
      setEditing(false);
      setStamp(true);
    }
    return result;
  }

  let body: ReactNode;
  if (ballot.status === 'loading')
    body = <p className="ht-ballot-empty">Checking your sign-in…</p>;
  else if (ballot.status === 'error')
    body = (
      <p className="ht-ballot-empty" role="alert">
        The ballot could not be loaded. Refresh the page to try again.
      </p>
    );
  else if (!ballot.signedIn)
    body = (
      <p className="ht-ballot-empty">
        {ballot.locked
          ? 'Sign in with your manager account to see every ballot.'
          : 'Sign in with your manager account to file a ballot.'}{' '}
        <a href="/matchups">Sign in</a>
      </p>
    );
  else if (ballot.locked)
    body = <Revealed ballots={ballot.revealed} house={house} teams={teams} />;
  else if (ballot.own && !editing)
    body = (
      <div className="ht-ballot-filed">
        <AnimatePresence>
          {stamp && (
            <motion.span
              className="ht-stamp ht-ballot-stamp"
              initial={{ scale: 1.8, opacity: 0, rotate: -14 }}
              animate={{ scale: 1, opacity: 1, rotate: -6 }}
              transition={{ type: 'spring', bounce: 0.35, duration: 0.5 }}
            >
              FILED
            </motion.span>
          )}
        </AnimatePresence>
        <h3>Your ballot is filed.</h3>
        <p>Private until {lockText}.</p>
        <Summary ballot={ballot.own} teams={byId} />
        <button
          type="button"
          className="ht-ballot-edit"
          onClick={() => {
            setStamp(false);
            setEditing(true);
          }}
        >
          Change my ballot
        </button>
        {/* Filing a ballot unlocks the house call; the managers' ballots
            stay sealed until the lock. */}
        <motion.div
          className="ht-ballot-house-reveal"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: stamp ? 0.35 : 0, ease }}
        >
          <p>
            {championOf(ballot.own) === championOf(house)
              ? 'You and Mackorcle have the same champion. Here is his full call.'
              : 'Your ballot is in, so here is how Mackorcle called it.'}
          </p>
          <HouseBallot house={house} teams={byId} />
        </motion.div>
      </div>
    );
  else
    body = (
      <Builder
        teams={teams}
        start={ballot.own}
        onSave={save}
        onCancel={ballot.own ? () => setEditing(false) : undefined}
      />
    );

  return (
    <MotionConfig reducedMotion={paused || reduce ? 'always' : 'user'}>
      <div className="ht-ballot">
        <p className="ht-ballot-status">
          {ballot.locked
            ? 'Locked · every ballot revealed'
            : `Locks ${lockText}`}
          {!ballot.locked && ballot.filed !== null && (
            <span>{ballot.filed} of 12 filed</span>
          )}
        </p>
        {body}
        {!ballot.locked && (
          <p className="ht-ballot-footnote">
            File your ballot to see Mackorcle’s. Everyone else’s is revealed at
            the lock. Tables are scored against Week 14 and every correct
            playoff pick earns a point.
          </p>
        )}
      </div>
    </MotionConfig>
  );
}
