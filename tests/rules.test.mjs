import assert from 'node:assert/strict';
import test from 'node:test';
import {
  rosterScore,
  matchupScore,
  formatScore,
} from '../lib/sleeper/scores.ts';
import {
  GRADING_DELAY_MS,
  sundayKickoffForWeek,
  isGradingEligible,
  formatLockTime,
  signInErrorMessage,
} from '../lib/predictions/rules.ts';

void test('Sleeper hundredths preserve leading zeroes', () => {
  assert.equal(rosterScore(1795, 8), 1795.08);
  assert.equal(rosterScore(1602, 2), 1602.02);
  assert.equal(rosterScore(14, 50), 14.5);
  assert.equal(rosterScore(0), 0);
});
void test('missing and malformed scores remain unavailable, not zero or NaN', () => {
  for (const value of [undefined, null, NaN, Infinity, '20'])
    assert.equal(rosterScore(value), null);
  assert.equal(rosterScore(20, 100), null);
  assert.equal(formatScore(null), 'Unavailable');
  assert.equal(formatScore(NaN), 'Unavailable');
  assert.equal(formatScore(0), '0.0');
  assert.equal(formatScore(110.04, 2), '110.04');
  assert.equal(formatScore(110.03, 2), '110.03');
});
void test('commissioner-adjusted matchup totals take precedence, including zero', () => {
  assert.equal(matchupScore({ points: 100, custom_points: 105 }), 105);
  assert.equal(matchupScore({ points: 100, custom_points: 0 }), 0);
  assert.equal(matchupScore({ points: 100, custom_points: null }), 100);
  assert.equal(matchupScore({}), null);
});
void test('all picks lock at the Sunday 1pm Eastern kickoff, including DST changes', () => {
  assert.equal(
    sundayKickoffForWeek(2026, 1).toISOString(),
    '2026-09-13T17:00:00.000Z',
  );
  assert.equal(
    sundayKickoffForWeek(2026, 8).toISOString(),
    '2026-11-01T18:00:00.000Z',
  );
  assert.equal(
    sundayKickoffForWeek(2026, 18).toISOString(),
    '2027-01-10T18:00:00.000Z',
  );
});
void test('Tuesday is too early; Wednesday grading includes the precise boundary', () => {
  const lock = sundayKickoffForWeek(2026, 1).toISOString();
  assert.equal(
    isGradingEligible(lock, Date.parse('2026-09-15T10:00:00Z')),
    false,
  );
  assert.equal(
    isGradingEligible(lock, Date.parse(lock) + GRADING_DELAY_MS - 1),
    false,
  );
  assert.equal(
    isGradingEligible(lock, Date.parse(lock) + GRADING_DELAY_MS),
    true,
  );
  assert.equal(
    isGradingEligible(lock, Date.parse('2026-09-16T10:00:00Z')),
    true,
  );
});
void test('deadline formatting uses an explicit Irish timezone and locale', () => {
  assert.match(
    formatLockTime('2026-09-13T17:00:00Z'),
    /Sunday.*13.*Sept.*18:00.*Irish time/,
  );
});
void test('offline and service failures do not accuse the member of a wrong password', () => {
  assert.match(signInErrorMessage({}, false), /offline/);
  assert.match(
    signInErrorMessage({ code: 'invalid_credentials' }),
    /did not match/,
  );
  assert.match(signInErrorMessage({ status: 429 }), /Too many/);
  assert.match(
    signInErrorMessage({ status: 503 }),
    /password may still be correct/,
  );
});
