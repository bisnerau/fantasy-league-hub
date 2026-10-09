import test from 'node:test';
import assert from 'node:assert/strict';
import { fractionalOdds } from '../lib/predictions/fractional-odds.ts';

await test('fractional odds return the base point plus the fractional reward', () => {
  assert.deepEqual(fractionalOdds(0.25), { label: '3/1', payout: 4 });
  assert.deepEqual(fractionalOdds(0.5), { label: '1/1', payout: 2 });
  assert.deepEqual(fractionalOdds(2 / 3), { label: '1/2', payout: 1.5 });
  assert.deepEqual(fractionalOdds(0.75), { label: '1/3', payout: 1.33 });
});

await test('rounded prices settle at the displayed fraction, not the raw probability', () => {
  const price = fractionalOdds(0.3477);
  assert.deepEqual(price, { label: '15/8', payout: 2.88 });
  let previous = Infinity;
  for (let chance = 0.01; chance < 1; chance += 0.01) {
    const { label, payout } = fractionalOdds(chance);
    const [numerator, denominator] = label.split('/').map(Number);
    assert.equal(payout, Math.round((1 + numerator / denominator) * 100) / 100);
    assert.ok(payout <= previous);
    previous = payout;
  }
});

await test('unknown or certain probabilities cannot silently produce a price', () => {
  for (const value of [0, 1, -1, 2, NaN, Infinity])
    assert.throws(() => fractionalOdds(value), RangeError);
});
