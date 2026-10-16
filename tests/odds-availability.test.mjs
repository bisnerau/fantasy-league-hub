import assert from 'node:assert/strict';
import { test } from 'node:test';
import { unavailableForOdds } from '../scripts/odds-availability.mjs';

void test('unavailable players cannot enter the pricing lineup through stale projections', () => {
  for (const status of ['Out', 'IR', 'PUP', 'Sus']) {
    assert.equal(
      unavailableForOdds('receiver', { points: 20, locked: false }, status),
      true,
    );
    assert.equal(
      unavailableForOdds('starter', { points: 0, locked: true }, status),
      false,
    );
  }
  assert.equal(unavailableForOdds('bye', { points: null }, null), true);
  assert.equal(unavailableForOdds('unknown', { points: NaN }, null), true);
  assert.equal(unavailableForOdds('0', { points: 0 }, null), true);
  assert.equal(
    unavailableForOdds('active', { points: 20 }, 'Questionable'),
    false,
  );
  assert.equal(unavailableForOdds('active', { points: 20 }, null), false);
});
