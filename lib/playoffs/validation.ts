import { projectLineup } from './lineups';
import type { ForecastInput, ForecastResult } from './types';
export function validateInput(input: ForecastInput) {
  const ids = new Set(input.teams.map((t) => t.id));
  if (
    ids.size !== input.teams.length ||
    input.playoffTeams < 1 ||
    input.playoffTeams >= ids.size
  )
    throw Error('Invalid teams');
  if (
    input.teams.some(
      (t) =>
        ![t.wins, t.losses, t.ties, t.pointsFor, t.pointsAgainst].every(
          Number.isFinite,
        ) || t.wins + t.losses + t.ties !== input.completedThrough,
    )
  )
    throw Error('Invalid completed-week baseline');
  if (
    !Number.isFinite(input.calibration.teamVarianceScale) ||
    input.calibration.teamVarianceScale <= 0
  )
    throw Error('Invalid calibration');
  const keys = new Set<string>();
  for (
    let week = input.completedThrough + 1;
    week <= input.regularSeasonWeeks;
    week++
  ) {
    const fixtures = input.fixtures.filter((f) => f.week === week),
      seen = new Set<number>();
    for (const f of fixtures) {
      if (
        keys.has(f.key) ||
        !ids.has(f.home) ||
        !ids.has(f.away) ||
        seen.has(f.home) ||
        seen.has(f.away) ||
        f.home === f.away
      )
        throw Error('Invalid remaining schedule');
      keys.add(f.key);
      seen.add(f.home);
      seen.add(f.away);
    }
    if (seen.size !== ids.size) throw Error('Missing remaining fixture');
    for (const id of ids) {
      const lineups = input.lineups.filter(
        (l) => l.week === week && l.rosterId === id,
      );
      if (lineups.length !== 1) throw Error('Missing or duplicate lineup');
      const l = lineups[0];
      if (
        new Set(l.players.map((p) => p.id)).size !== l.players.length ||
        l.players.some(
          (p) =>
            !Number.isFinite(p.mean) ||
            !Number.isFinite(p.variance) ||
            p.variance < 0,
        )
      )
        throw Error('Invalid scoring inputs');
      if (
        new Set(l.locked.map((p) => p.slot)).size !== l.locked.length ||
        l.locked.some((p) => p.slot < 0 || p.slot >= input.slots.length)
      )
        throw Error('Invalid locked slots');
      if (
        l.locked.some((p) => {
          const player = l.players.find((x) => x.id === p.playerId);
          return (
            !player ||
            player.state === 'pre' ||
            (player.state === 'post' && !Number.isFinite(player.actual))
          );
        })
      )
        throw Error('Invalid locked starter');
      projectLineup(input, l);
    }
  }
  if (input.fixtures.length !== keys.size)
    throw Error('Unexpected forecast fixture');
  for (const r of input.returns)
    if (
      !r.source.startsWith('https://') ||
      !r.checkedAt ||
      !Number.isInteger(r.earliestWeek) ||
      !Number.isInteger(r.latestWeek) ||
      r.latestWeek < r.earliestWeek
    )
      throw Error('Invalid injury assumption');
}
export function validateResult(input: ForecastInput, result: ForecastResult) {
  if (
    !result.reliable ||
    result.teams.length !== input.teams.length ||
    result.teams.some(
      (t) =>
        ![t.playoff, t.last].every(
          (p) => Number.isFinite(p) && p >= 0 && p <= 1,
        ),
    )
  )
    throw Error('Invalid forecast probabilities');
  const playoff = result.teams.reduce((s, t) => s + t.playoff, 0),
    last = result.teams.reduce((s, t) => s + t.last, 0);
  if (
    Math.abs(playoff - input.playoffTeams) > 1e-8 ||
    Math.abs(last - 1) > 1e-8
  )
    throw Error('Forecast probability totals failed');
}
