'use client';

import { ArrowDown, ArrowUp, ChevronDown, RotateCcw } from 'lucide-react';
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useReorder } from '@/components/effects/reorder-list';
import { TeamAvatar } from '@/components/shared/team-avatar';
import {
  formatRecord,
  sortStandings,
  type SortKey,
  type TeamStanding,
} from '@/lib/data/standings';
import { prefersReducedMotion } from '@/lib/motion';
import { formatScore } from '@/lib/sleeper/scores';
import { cn } from '@/lib/utils';

const CHIPS: { key: SortKey; label: string; stat: string }[] = [
  { key: 'rank', label: 'Table', stat: 'PF' },
  { key: 'pointsFor', label: 'Points', stat: 'PF' },
  { key: 'allPlay', label: 'All-play', stat: 'All-play' },
  { key: 'median', label: 'Median', stat: 'Median' },
];

const REPLAY = { hold: 800, duration: 900 };

type Phase = 'idle' | 'previous' | 'replay';

/** The league table: compact rows, sort chips and a verified weekly replay. */
export function LeagueTable({
  heading,
  standings,
  playoffTeams,
  historyAvailable,
  week,
}: {
  heading: ReactNode;
  standings: TeamStanding[];
  playoffTeams: number;
  historyAvailable: boolean;
  week: number;
}) {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [open, setOpen] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const listRef = useRef<HTMLOListElement>(null);
  const timers = useRef<number[]>([]);

  const canReplay =
    week > 1 &&
    standings.every((team) => team.previousRank != null) &&
    standings.some((team) => team.previousRank !== team.rank);
  const chips = CHIPS.filter(
    (chip) =>
      (chip.key !== 'allPlay' ||
        standings.some((team) => team.allPlay != null)) &&
      (chip.key !== 'median' || historyAvailable),
  );
  const rows =
    phase === 'previous'
      ? [...standings].sort((a, b) => a.previousRank! - b.previousRank!)
      : sortStandings(standings, sortKey);
  const tableOrder = phase !== 'idle' || sortKey === 'rank';
  const capture = useReorder(
    listRef,
    `${phase}:${rows.map((team) => team.rosterId).join(',')}`,
  );
  const stat = CHIPS.find((chip) => chip.key === sortKey)!.stat;

  function clearTimers() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }

  function replay() {
    if (!canReplay || prefersReducedMotion()) return;
    clearTimers();
    setOpen(null);
    setSortKey('rank');
    setPhase('previous');
    timers.current.push(
      window.setTimeout(() => {
        capture({ duration: REPLAY.duration, stagger: 0 });
        setPhase('replay');
        timers.current.push(
          window.setTimeout(() => setPhase('idle'), REPLAY.duration + 700),
        );
      }, REPLAY.hold),
    );
  }

  function sort(key: SortKey) {
    if (key === sortKey && phase === 'idle') return;
    clearTimers();
    capture();
    setOpen(null);
    setPhase('idle');
    setSortKey(key);
  }

  const autoplay = useEffectEvent(replay);
  useEffect(() => {
    const list = listRef.current;
    if (!list || !canReplay || prefersReducedMotion()) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        autoplay();
      },
      { threshold: 0.4 },
    );
    observer.observe(list);
    return () => observer.disconnect();
  }, [canReplay]);
  useEffect(() => clearTimers, []);

  const lineAfter = (index: number): ReactNode => {
    if (!tableOrder) return null;
    const seed = index + 1;
    if (seed === 2 && playoffTeams === 6)
      return <TableLine key="bye" label="Bye" tone="bye" />;
    if (seed === playoffTeams && seed < rows.length)
      return <TableLine key="cut" label="Playoff line" tone="cut" />;
    return null;
  };

  return (
    <div>
      <div className="section-heading">
        <div>{heading}</div>
        {canReplay && (
          <button
            type="button"
            className="replay-button"
            onClick={replay}
            disabled={phase !== 'idle'}
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            {phase === 'previous'
              ? `After Week ${week - 1}`
              : phase === 'replay'
                ? `After Week ${week}`
                : `Replay Week ${week}`}
          </button>
        )}
      </div>
      <fieldset className="sort-chips">
        <legend className="sr-only">Sort the league table</legend>
        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            className="sort-chip"
            aria-pressed={phase === 'idle' && sortKey === chip.key}
            onClick={() => sort(chip.key)}
          >
            {chip.label}
          </button>
        ))}
      </fieldset>
      <p className="sr-only" aria-live="polite">
        {phase === 'previous'
          ? `Showing the table after Week ${week - 1}`
          : phase === 'replay'
            ? `Moving to the table after Week ${week}`
            : ''}
      </p>

      <div className="standings-head" aria-hidden="true">
        <span>#</span>
        <span className="text-left">Team</span>
        <span>W-L</span>
        <span className="standings-wide">PA</span>
        <span className="standings-wide">Median</span>
        <span className="standings-wide">Streak</span>
        <span>{stat}</span>
        <span />
      </div>
      <ol
        ref={listRef}
        className="standings-list"
        data-phase={phase}
        aria-label="League table"
        aria-busy={phase !== 'idle' || undefined}
      >
        {rows.flatMap((team, index) => {
          const shownRank =
            phase === 'previous' ? team.previousRank! : team.rank;
          const moved =
            team.previousRank == null ? 0 : team.previousRank - team.rank;
          const expanded = open === team.rosterId;
          const tapeId = `tape-${team.rosterId}`;
          const row = (
            <li
              key={team.rosterId}
              data-reorder-key={team.rosterId}
              className="standings-row"
              data-top={team.rank <= playoffTeams || undefined}
              data-move={
                phase === 'replay' && moved
                  ? moved > 0
                    ? 'up'
                    : 'down'
                  : undefined
              }
              data-open={expanded || undefined}
            >
              <button
                type="button"
                className="standings-row-button"
                aria-expanded={expanded}
                aria-controls={tapeId}
                onClick={() => setOpen(expanded ? null : team.rosterId)}
              >
                <span className="standings-rank">
                  <span className="sr-only">Seed </span>
                  {shownRank}
                  {phase !== 'previous' && <Movement change={moved} />}
                </span>
                <span className="flex min-w-0 items-center gap-2.5">
                  <TeamAvatar
                    avatar={team.avatar}
                    name={team.teamName}
                    className="size-7 min-[375px]:size-8"
                  />
                  <span className="min-w-0 text-left">
                    <span
                      className={cn(
                        'block text-sm font-bold',
                        !expanded && 'truncate',
                      )}
                    >
                      {team.teamName}
                    </span>
                    <span
                      className={cn(
                        'block text-[11px] text-muted-foreground',
                        !expanded && 'truncate',
                      )}
                    >
                      {team.ownerName}
                    </span>
                  </span>
                </span>
                <span className="standings-value">
                  <span className="sr-only">Record </span>
                  {formatRecord(team)}
                </span>
                <span className="standings-value standings-wide">
                  <span className="sr-only">Points against </span>
                  {team.pointsAgainst == null
                    ? '—'
                    : team.pointsAgainst.toFixed(1)}
                </span>
                <span className="standings-value standings-wide">
                  <span className="sr-only">Median record </span>
                  {historyAvailable
                    ? `${team.medianWins}-${team.medianLosses}`
                    : '—'}
                </span>
                <span className="standings-value standings-wide">
                  <span className="sr-only">Streak </span>
                  {team.streak}
                </span>
                <span className="standings-value standings-stat">
                  <span className="sr-only">{stat} </span>
                  {statValue(team, sortKey, historyAvailable)}
                </span>
                <ChevronDown
                  className="standings-chevron size-4"
                  aria-hidden="true"
                />
              </button>
              <div id={tapeId} className="standings-tape" hidden={!expanded}>
                <dl className="standings-tape-grid">
                  <TapeStat label="Against">
                    {formatScore(team.pointsAgainst)}
                  </TapeStat>
                  <TapeStat label="Median">
                    {historyAvailable
                      ? `${team.medianWins}-${team.medianLosses}`
                      : 'Unavailable'}
                  </TapeStat>
                  <TapeStat label="All-play">
                    {team.allPlay ? formatRecord(team.allPlay) : 'Unavailable'}
                  </TapeStat>
                  <TapeStat label="Streak">{team.streak}</TapeStat>
                  <TapeStat label="Form">
                    {team.form.length
                      ? team.form.slice(-5).join(' ')
                      : 'Unavailable'}
                  </TapeStat>
                </dl>
                <a
                  href={
                    team.franchiseId
                      ? `/managers#${team.franchiseId}`
                      : '/managers'
                  }
                  className="clubhouse-text-link mt-3 min-h-11"
                >
                  Manager profile
                  <span className="sr-only">: {team.ownerName}</span>
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </li>
          );
          const line = lineAfter(index);
          return line ? [row, line] : [row];
        })}
      </ol>
      <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
        {playoffTeams === 6 ? 'Top two earn a bye. ' : ''}Top {playoffTeams}{' '}
        make the playoffs. Tap a team for the tale of the tape.
      </p>
    </div>
  );
}

function statValue(
  team: TeamStanding,
  key: SortKey,
  historyAvailable: boolean,
) {
  if (key === 'allPlay') return team.allPlay ? formatRecord(team.allPlay) : '—';
  if (key === 'median')
    return historyAvailable ? `${team.medianWins}-${team.medianLosses}` : '—';
  return team.pointsFor == null ? '—' : team.pointsFor.toFixed(1);
}

function Movement({ change }: { change: number }) {
  if (!change) return null;
  const Icon = change > 0 ? ArrowUp : ArrowDown;
  return (
    <span
      className={cn('standings-move', change > 0 && 'text-primary')}
      title={`${change > 0 ? 'Up' : 'Down'} ${Math.abs(change)} since last week`}
    >
      <Icon className="size-3" aria-hidden="true" />
      <span aria-hidden="true">{Math.abs(change)}</span>
      <span className="sr-only">
        , {change > 0 ? 'up' : 'down'} {Math.abs(change)}{' '}
        {Math.abs(change) === 1 ? 'place' : 'places'} since last week
      </span>
    </span>
  );
}

function TapeStat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="metric-label">{label}</dt>
      <dd className="mt-0.5 font-mono text-sm font-bold">{children}</dd>
    </div>
  );
}

function TableLine({ label, tone }: { label: string; tone: 'bye' | 'cut' }) {
  return (
    <li className="table-line" data-tone={tone} aria-hidden="true">
      <span>{label}</span>
    </li>
  );
}
