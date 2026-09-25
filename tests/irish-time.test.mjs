import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatIrishTime } from '../lib/format/irish-time.ts';

// Every engine must print the same words, so these are exact strings.
void test('Irish times are spelled the same everywhere', () => {
  const lock = '2026-09-27T17:00:00Z';
  assert.equal(
    formatIrishTime(lock, { weekday: 'long', time: true }),
    'Sunday 27 Sep, 18:00',
  );
  assert.equal(
    formatIrishTime(lock, { weekday: 'short', time: true }),
    'Sun 27 Sep, 18:00',
  );
  assert.equal(
    formatIrishTime(lock, { weekday: 'short', date: false, time: true }),
    'Sun 18:00',
  );
  assert.equal(formatIrishTime(lock), '27 Sep');
  assert.equal(formatIrishTime(lock, { year: true }), '27 Sep 2026');
  assert.equal(
    formatIrishTime(Date.parse(lock), { year: true, time: true }),
    '27 Sep 2026, 18:00',
  );
});

void test('Irish clocks follow summer time and the calendar in Dublin', () => {
  // Winter: Irish time equals UTC.
  assert.equal(
    formatIrishTime('2026-12-06T18:00:00Z', { weekday: 'long', time: true }),
    'Sunday 6 Dec, 18:00',
  );
  // 23:30 UTC on 30 Sep is already 1 Oct in Dublin (summer time).
  assert.equal(
    formatIrishTime('2026-09-30T23:30:00Z', { weekday: 'short', time: true }),
    'Thu 1 Oct, 00:30',
  );
  // Midnight reads 00:00, never 24:00.
  assert.equal(
    formatIrishTime('2027-01-01T00:00:00Z', { year: true, time: true }),
    '1 Jan 2027, 00:00',
  );
});

void test('invalid dates throw rather than print nonsense', () => {
  assert.throws(() => formatIrishTime('not a date'), RangeError);
});
