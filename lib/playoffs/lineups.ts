import type { ForecastInput, ForecastLineup, ForecastPlayer } from './types';

export function eligible(slot: string, position: string) {
  if (slot === 'WRRB_FLEX') return ['RB', 'WR'].includes(position);
  return slot === position;
}

export function projectLineup(
  input: Pick<ForecastInput, 'slots' | 'calibration'>,
  lineup: ForecastLineup,
  returns: Record<string, number> = {},
) {
  const selected: ForecastPlayer[] = [];
  const used = new Set(lineup.locked.map((p) => p.playerId));
  const locked = new Map(lineup.locked.map((p) => [p.slot, p.playerId]));
  const pool = lineup.players
    .filter(
      (p) =>
        p.state === 'pre' &&
        (returns[p.id] !== undefined
          ? lineup.week >= returns[p.id]
          : p.available),
    )
    .sort((a, b) => b.mean - a.mean || a.id.localeCompare(b.id));
  const order = input.slots
    .map((slot, index) => ({ slot, index }))
    .sort(
      (a, b) => Number(a.slot === 'WRRB_FLEX') - Number(b.slot === 'WRRB_FLEX'),
    );
  for (const { slot, index } of order) {
    const lockedId = locked.get(index);
    const player = lockedId
      ? lineup.players.find((p) => p.id === lockedId)
      : pool.find((p) => !used.has(p.id) && eligible(slot, p.position));
    if (lockedId && !player)
      throw new Error('Locked starter is missing from forecast');
    if (!player) continue;
    if (
      selected.some((p) => p.id === player.id) ||
      !eligible(slot, player.position)
    )
      throw new Error('Invalid forecast lineup');
    used.add(player.id);
    selected.push(player);
  }
  return {
    mean: selected.reduce(
      (s, p) =>
        s +
        (p.state === 'post'
          ? p.actual!
          : p.state === 'in' && !p.available
            ? 0
            : p.mean),
      0,
    ),
    variance:
      selected.reduce(
        (s, p) =>
          s +
          (p.state === 'post' || (p.state === 'in' && !p.available)
            ? 0
            : p.variance),
        0,
      ) * input.calibration.teamVarianceScale,
    players: selected.map((p) => p.id),
    complete:
      selected.length === input.slots.length &&
      selected.every((p) => p.state === 'post'),
  };
}
