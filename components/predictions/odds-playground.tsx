'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Dices,
  ReceiptText,
  RotateCcw,
  Trophy,
  Vote,
  X,
  Zap,
} from 'lucide-react';
import sample from '@/lib/data/experiments/odds-week-five.json';
import { matchupNewsletters } from '@/lib/data/matchup-newsletters';
import { matchOfTheWeekSelections } from '@/lib/data/match-of-the-week';
import { fractionalOdds } from '@/lib/predictions/fractional-odds';
import { getRemaining } from '@/lib/countdown';
import { formatIrishTime } from '@/lib/format/irish-time';
import { cn } from '@/lib/utils';
import { FlapCountdown } from '@/components/clubhouse/flap-countdown';
import { DriveTracker } from '@/components/clubhouse/drive-tracker';
import { TeamAvatar } from '@/components/shared/team-avatar';
import { SwipePick } from '@/components/effects/swipe-pick';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { OddsPlaygroundCard } from './odds-playground-card';

type Picks = Record<number, number>;
type Results = Record<number, number | 'tie'>;
type Team = (typeof sample.matchups)[number]['teams'][number];
export type TrialTeam = Team & {
  chance: number;
  fraction: string;
  payout: number;
  total: number;
};
export type TrialMatchup = { id: number; teams: TrialTeam[] };
const points = (n: number) => n.toFixed(2);
const featured = matchOfTheWeekSelections.find(
  (m) => m.season === String(sample.season) && m.week === sample.week,
);
const reports = matchupNewsletters.filter(
  (r) => r.season === String(sample.season) && r.week === sample.week,
);
const weeks = Array.from({ length: sample.week }, (_, i) => i + 1);
// Sunday 1pm Eastern lock for this week's picks (from the stored ballot).
const lock = Date.parse('2026-10-11T17:00:00Z');
const updated = formatIrishTime(sample.snapshot, {
  weekday: 'long',
  time: true,
});
const actionClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40';

export function OddsPlayground() {
  const [adjusted, setAdjusted] = useState(true);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, []);
  const [picks, setPicks] = useState<Picks>({});
  const [results, setResults] = useState<Results | null>(null);
  const [slipOpen, setSlipOpen] = useState(false);
  const [standings, setStandings] = useState(false);
  const slipToggle = useRef<HTMLButtonElement>(null);
  const matchups: TrialMatchup[] = sample.matchups
    .map((matchup) => {
      const [a, b] = matchup.teams;
      const homeChance =
        1 /
        (1 +
          Math.exp(
            -(
              (adjusted
                ? a.adjustedTotal - b.adjustedTotal
                : a.baseTotal - b.baseTotal) / 20
            ),
          ));
      return {
        ...matchup,
        teams: matchup.teams.map((team, index) => {
          const chance = index === 0 ? homeChance : 1 - homeChance;
          const price = fractionalOdds(chance);
          return {
            ...team,
            chance,
            // Bookmakers print an even-money price as Evens, not 1/1.
            fraction: price.label === '1/1' ? 'Evens' : price.label,
            payout: price.payout,
            total: adjusted ? team.adjustedTotal : team.baseTotal,
          };
        }),
      };
    })
    .sort(
      (a, b) =>
        Number(b.id === featured?.sleeperMatchupId) -
        Number(a.id === featured?.sleeperMatchupId),
    );
  const selectedCount = Object.keys(picks).length;
  const selected = matchups.flatMap((m) => {
    const team = m.teams.find((t) => t.id === picks[m.id]);
    return team ? [{ matchup: m.id, ...team }] : [];
  });
  const maximum = selected.reduce((sum, t) => sum + t.payout, 0);
  const earned = selected.reduce(
    (sum, t) => sum + (results?.[t.matchup] === t.id ? t.payout : 0),
    0,
  );
  const correct = selected.filter((t) => results?.[t.matchup] === t.id).length;
  const favourites = matchups.map((m) => ({
    matchup: m.id,
    ...m.teams.reduce((a, b) => (a.chance >= b.chance ? a : b)),
  }));
  const underdogs = matchups.map((m) => ({
    matchup: m.id,
    ...m.teams.reduce((a, b) => (a.chance < b.chance ? a : b)),
  }));
  const strategies = [
    { name: 'Your picks', picks: selected },
    { name: 'All favourites', picks: favourites },
    { name: 'All underdogs', picks: underdogs },
  ]
    .map((strategy) => ({
      name: strategy.name,
      correct: strategy.picks.filter((t) => results?.[t.matchup] === t.id)
        .length,
      points:
        Math.round(
          strategy.picks.reduce(
            (sum, t) => sum + (results?.[t.matchup] === t.id ? t.payout : 0),
            0,
          ) * 100,
        ) / 100,
    }))
    .sort((a, b) => b.points - a.points);
  function pick(matchup: number, team: number) {
    setPicks((previous) => ({ ...previous, [matchup]: team }));
  }
  function pickAll(risky: boolean) {
    setPicks(
      Object.fromEntries(
        (risky ? underdogs : favourites).map((t) => [t.matchup, t.id]),
      ),
    );
  }
  function simulate(kind: 'random' | 'favourites' | 'underdogs') {
    setResults(
      Object.fromEntries(
        matchups.map((m) => {
          const [a, b] = m.teams;
          const winner =
            kind === 'random'
              ? Math.random() < a.chance
                ? a
                : b
              : kind === 'favourites'
                ? a.chance >= b.chance
                  ? a
                  : b
                : a.chance < b.chance
                  ? a
                  : b;
          return [m.id, winner.id];
        }),
      ),
    );
    setSlipOpen(true);
  }
  function closeSlip() {
    setSlipOpen(false);
    slipToggle.current?.focus();
  }
  function edit() {
    setResults(null);
    setStandings(false);
    setSlipOpen(false);
  }

  return (
    <div className="picks-with-slip space-y-5">
      <section
        className="pick-spotlight picks-hero"
        aria-labelledby="picks-title"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="ui-kicker text-primary">Weekly picks · 2026</p>
          <span className="rounded-full border border-award/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-award">
            Odds preview
          </span>
        </div>
        <h1
          id="picks-title"
          className="week-title mt-2 font-heading text-5xl font-black leading-none tracking-[-0.06em] sm:text-6xl"
        >
          {standings ? 'Who calls it best?' : `Week ${sample.week}`}
        </h1>
        <div className="mt-3 flex items-center gap-2">
          <Vote className="size-4 text-primary" aria-hidden="true" />
          <h2 className="text-base font-semibold">
            {results ? 'Your calls. A pretend matchday.' : 'Make your calls'}
          </h2>
        </div>
        {!standings && (
          <div className="mt-4">
            <p className="ui-kicker">
              {results ? 'Simulated results' : 'Picks close in'}
            </p>
            {results ? (
              <p className="mt-2 text-xl font-bold">
                {correct} correct · {points(earned)} points returned
              </p>
            ) : (
              <div className="mt-2">
                <FlapCountdown
                  remaining={now == null ? null : getRemaining(lock, now)}
                  until="until the Sunday deadline"
                />
              </div>
            )}
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Sunday 11 Oct, 18:00 · Irish time. Odds updated {updated} · Irish
              time. Practice picks only: nothing here changes your real Weekly
              Picks.
            </p>
            <DriveTracker
              picks={selectedCount}
              total={6}
              banker={false}
              showBanker={false}
            />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="banker-line">
                Bigger odds. Bigger points.{' '}
                <span className="font-mono text-award">3/1 = 4 pts</span>
              </p>
              {!results && (
                <RapidTrial matchups={matchups} picks={picks} onPick={pick} />
              )}
            </div>
          </div>
        )}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="text-sm font-semibold">Your practice picks</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {selectedCount} of 6 picked · no changes to the real competition
            </p>
          </div>
          {results ? (
            <button type="button" className={actionClass} onClick={edit}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Edit picks
            </button>
          ) : (
            <button
              type="button"
              className={cn(actionClass, 'border-primary/40 text-primary')}
              disabled={selectedCount !== 6}
              onClick={() => simulate('random')}
            >
              <Dices className="size-4" aria-hidden="true" />
              Play out the week
            </button>
          )}
        </div>
      </section>

      <nav
        className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-muted/30 p-1"
        aria-label="Prediction views"
      >
        {[
          { label: 'Weekly picks', value: false, Icon: CalendarDays },
          { label: 'Prediction standings', value: true, Icon: Trophy },
        ].map(({ label, value, Icon }) => (
          <button
            key={label}
            type="button"
            className={cn(
              'flex min-h-11 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors',
              standings === value
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-white/[0.035] hover:text-foreground',
            )}
            aria-pressed={standings === value}
            onClick={() => setStandings(value)}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>
      {!standings && (
        <nav aria-label="Season weeks">
          <ol className="snap-rail season-rail">
            {weeks.map((week) => (
              <li key={week}>
                <span
                  className="week-chip"
                  data-state={week === sample.week ? 'open' : 'past'}
                  aria-current={week === sample.week ? 'page' : undefined}
                  aria-label={`Week ${week}${week === sample.week ? ', preview' : ', not included in this preview'}`}
                >
                  <span className="font-mono text-sm font-black">W{week}</span>
                  <span className="week-chip-state" aria-hidden="true">
                    {week === sample.week && <span className="live-dot" />}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <details className="rounded-xl border border-border bg-card px-4 py-1">
        <summary className="cursor-pointer py-3 text-xs font-semibold text-muted-foreground">
          Demo controls · {adjusted ? 'opponent adjusted' : 'simple odds'}
        </summary>
        <div className="space-y-3 pb-3">
          <fieldset className="flex flex-wrap gap-2" aria-label="Odds model">
            {[
              { label: 'Simple odds', value: false },
              { label: 'Opponent adjusted', value: true },
            ].map((mode) => (
              <button
                key={mode.label}
                type="button"
                aria-pressed={adjusted === mode.value}
                disabled={results !== null}
                onClick={() => setAdjusted(mode.value)}
                className={cn(
                  actionClass,
                  adjusted === mode.value &&
                    'border-primary bg-primary/10 text-primary',
                )}
              >
                {mode.label}
              </button>
            ))}
          </fieldset>
          <div className="flex flex-wrap gap-2">
            {!results ? (
              <>
                <button
                  type="button"
                  className={actionClass}
                  onClick={() => pickAll(false)}
                >
                  All favourites
                </button>
                <button
                  type="button"
                  className={actionClass}
                  onClick={() => pickAll(true)}
                >
                  All underdogs
                </button>
                <button
                  type="button"
                  className={actionClass}
                  onClick={() => setPicks({})}
                >
                  Clear slip
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={actionClass}
                  onClick={() => simulate('random')}
                >
                  Simulate again
                </button>
                <button
                  type="button"
                  className={actionClass}
                  onClick={() => simulate('favourites')}
                >
                  Favourites win
                </button>
                <button
                  type="button"
                  className={actionClass}
                  onClick={() => simulate('underdogs')}
                >
                  Upset week
                </button>
              </>
            )}
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            Real Week {sample.week} squads, approximate prices, pretend results.
            Everyone would get the same final Sunday odds. Here you can switch
            models before simulation. Refresh to start again.
          </p>
        </div>
      </details>

      {!standings && (
        <div className="space-y-4">
          {matchups.map((matchup) => (
            <OddsPlaygroundCard
              key={matchup.id}
              matchup={matchup}
              selectedId={picks[matchup.id]}
              result={results?.[matchup.id]}
              adjusted={adjusted}
              week={sample.week}
              basis={sample.lineupBasis}
              feature={
                matchup.id === featured?.sleeperMatchupId ? featured : undefined
              }
              report={
                reports.find((r) => r.sleeperMatchupId === matchup.id)
                  ?.preview ?? undefined
              }
              onPick={(team) => pick(matchup.id, team)}
              onResult={(result) =>
                setResults((previous) =>
                  previous ? { ...previous, [matchup.id]: result } : previous,
                )
              }
            />
          ))}
        </div>
      )}
      <section className="podium-panel" aria-labelledby="practice-table-title">
        <div className="border-b border-border px-4 py-4 sm:px-5">
          <h2 id="practice-table-title" className="text-base font-bold">
            Week {sample.week} prediction table · practice
          </h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Correct picks earn the displayed return. Wrong or tied picks earn
            zero. No Banker.
          </p>
        </div>
        {!results ? (
          <p className="px-5 py-8 text-sm leading-6 text-muted-foreground">
            Pick all six games and play out the week to compare your calls with
            the favourites and underdogs.
          </p>
        ) : (
          <>
            <ol className="podium-stage" aria-hidden="true">
              {[1, 0, 2].map((index) => {
                const row = strategies[index];
                const rank =
                  strategies.findIndex((r) => r.points === row.points) + 1;
                return (
                  <li
                    key={row.name}
                    className="podium-step"
                    data-medal={['gold', 'silver', 'bronze'][rank - 1]}
                  >
                    <span className="podium-name">{row.name}</span>
                    <span className="podium-points">
                      {points(row.points)}{' '}
                      <span className="text-[10px]">pts</span>
                    </span>
                    <span className="podium-block">{rank}</span>
                  </li>
                );
              })}
            </ol>
            <ol className="podium-rows" aria-label="Practice standings">
              {strategies.map((row) => (
                <li
                  key={row.name}
                  className={cn(
                    'podium-row',
                    row.name === 'Your picks' && 'podium-row-you',
                  )}
                >
                  <span className="podium-rank">
                    {strategies.findIndex((r) => r.points === row.points) + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">
                      {row.name}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">
                      {row.correct}/6 correct · same simulated results
                    </span>
                  </span>
                  <span className="font-mono text-base font-bold text-primary">
                    {points(row.points)}{' '}
                    <span className="text-[10px] text-muted-foreground">
                      pts
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}
      </section>

      <aside className="bet-slip" aria-label="Your practice bet slip">
        {slipOpen && (
          <TrialDocket
            matchups={matchups}
            picks={picks}
            results={results}
            total={results ? earned : maximum}
            onClose={closeSlip}
            onJump={(id) => {
              setStandings(false);
              setSlipOpen(false);
              setTimeout(() => {
                const card = document.getElementById(`trial-matchup-${id}`);
                card?.scrollIntoView({ block: 'center', behavior: 'instant' });
                card
                  ?.querySelector<HTMLButtonElement>(
                    '.faceoff-pick:not(:disabled)',
                  )
                  ?.focus({ preventScroll: true });
              }, 0);
            }}
            onSimulate={() => simulate('random')}
            onEdit={edit}
          />
        )}
        <div className="bet-slip-bar">
          <div className="slip-text" aria-live="polite">
            <p className="slip-title">
              {results
                ? `Returned ${points(earned)} pts`
                : `${selectedCount}/6 picks made`}
            </p>
            <p className="slip-meta">
              {results
                ? `${correct} correct · simulated results`
                : `Returns up to ${points(maximum)} pts · fractional odds`}
            </p>
          </div>
          <button
            ref={slipToggle}
            type="button"
            className="slip-action"
            aria-expanded={slipOpen}
            aria-controls={slipOpen ? 'trial-docket' : undefined}
            onClick={() => setSlipOpen((open) => !open)}
          >
            <ReceiptText className="size-4" aria-hidden="true" />
            {slipOpen ? 'Hide slip' : results ? 'See your docket' : 'View slip'}
          </button>
        </div>
      </aside>
    </div>
  );
}

function TrialDocket({
  matchups,
  picks,
  results,
  total,
  onClose,
  onJump,
  onSimulate,
  onEdit,
}: {
  matchups: TrialMatchup[];
  picks: Picks;
  results: Results | null;
  total: number;
  onClose: () => void;
  onJump: (id: number) => void;
  onSimulate: () => void;
  onEdit: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus(), []);
  const count = Object.keys(picks).length;
  return (
    <section
      id="trial-docket"
      className="docket"
      aria-label="Your practice docket"
    >
      <div className="docket-paper">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="docket-head">MAC 12 · WK 4</p>
            <p className="docket-sub">
              {count} selections · {results ? 'demo results' : 'practice slip'}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="docket-close"
            aria-label="Close your slip"
            onClick={onClose}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <ol className="docket-lines">
          {matchups.map((m) => {
            const team = m.teams.find((t) => t.id === picks[m.id]);
            return (
              <li key={m.id} className="docket-line-open">
                <button
                  type="button"
                  className="docket-line-button"
                  onClick={() => onJump(m.id)}
                >
                  <span className="min-w-0">
                    <span className="block truncate">
                      {team?.name ?? 'No pick yet'}
                    </span>
                    <span className="block text-[10px] opacity-60">
                      {team
                        ? `${team.fraction} · ${points(team.payout)} pts return`
                        : `${m.teams[0].name} v ${m.teams[1].name}`}
                    </span>
                  </span>
                  {results ? (
                    <span
                      className="docket-mark"
                      data-verdict={
                        results[m.id] === 'tie'
                          ? 'void'
                          : results[m.id] === team?.id
                            ? 'won'
                            : 'lost'
                      }
                    >
                      {results[m.id] === 'tie'
                        ? 'TIE'
                        : results[m.id] === team?.id
                          ? `+${points(team.payout)}`
                          : '0.00'}
                    </span>
                  ) : (
                    <span className="docket-jump">
                      {team ? 'Change' : 'Pick'}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
        <p className="docket-total">
          <span>{results ? 'Returned' : 'Returns up to'}</span>
          <span data-testid="slip-total">{points(total)} pts</span>
        </p>
        <p className="mt-2 text-[10px] opacity-70">
          3/1 pays 4 pts. 1/2 pays 1.5 pts. Wrong or tied: 0.
        </p>
        {results ? (
          <button
            type="button"
            className="slip-action mt-4 w-full justify-center"
            onClick={onEdit}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Edit my picks
          </button>
        ) : (
          <button
            type="button"
            disabled={count !== 6}
            className="slip-action mt-4 w-full justify-center disabled:opacity-40"
            onClick={onSimulate}
          >
            <Dices className="size-4" aria-hidden="true" />
            {count === 6 ? 'Play out the week' : `${6 - count} picks to go`}
          </button>
        )}
      </div>
    </section>
  );
}

function RapidTrial({
  matchups,
  picks,
  onPick,
}: {
  matchups: TrialMatchup[];
  picks: Picks;
  onPick: (matchup: number, team: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const remaining = matchups.filter((m) => picks[m.id] === undefined);
  const current = remaining[0];
  const choose = (side: 'home' | 'away') => {
    if (current) onPick(current.id, current.teams[side === 'home' ? 0 : 1].id);
  };
  const arrows = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      choose(event.key === 'ArrowLeft' ? 'home' : 'away');
    }
  };
  if (!current && !open) return null;
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="rapid-trigger">
        <Zap className="size-4" aria-hidden="true" />
        Rapid-fire slip
      </DrawerTrigger>
      <DrawerContent className="sm:mx-auto sm:max-w-md">
        <DrawerHeader className="pb-3">
          <p className="ui-kicker">Rapid-fire slip</p>
          <DrawerTitle className="text-xl font-bold tracking-tight">
            {current ? `${remaining.length} picks to go` : 'Slip complete'}
          </DrawerTitle>
          <DrawerDescription className="text-xs">
            Swipe towards a team, tap a button, or use the arrow keys.
          </DrawerDescription>
        </DrawerHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-4">
          {current ? (
            <div
              className="quick-stack"
              data-left={Math.min(remaining.length, 3)}
            >
              <SwipePick key={current.id} disabled={false} onPick={choose}>
                <p className="text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Matchup {current.id}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {current.teams.map((team, index) => (
                    <div
                      key={team.id}
                      className="quick-team"
                      data-side={index === 0 ? 'home' : 'away'}
                    >
                      <TeamAvatar
                        avatar={team.avatar}
                        name={team.teamName}
                        className="size-14"
                      />
                      <p className="mt-2 text-base font-bold">{team.name}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {team.teamName}
                      </p>
                      <p className="mt-3 font-mono text-3xl font-black">
                        {team.fraction}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Returns {points(team.payout)} pts
                      </p>
                      <button
                        type="button"
                        className="slip-action mt-4 w-full justify-center"
                        aria-label={`Quick pick ${team.name} at ${team.fraction}`}
                        onKeyDown={arrows}
                        onClick={() => choose(index === 0 ? 'home' : 'away')}
                      >
                        {index === 0 && (
                          <ArrowLeft className="size-4" aria-hidden="true" />
                        )}
                        Pick
                        {index === 1 && (
                          <ArrowRight className="size-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </SwipePick>
            </div>
          ) : (
            <div className="py-8 text-center">
              <Check
                className="mx-auto size-8 text-primary"
                aria-hidden="true"
              />
              <p className="mt-3 text-sm text-muted-foreground">
                All six calls are on your practice slip.
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
