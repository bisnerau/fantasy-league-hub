import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getMatchupNewsletter } from '../lib/data/matchup-newsletters.ts';

const key = {
  leagueId: 'fixture',
  season: '2026',
  week: 2,
  sleeperMatchupId: 1,
  homeRosterId: 6,
  awayRosterId: 8,
};
const preview = {
  version: 1,
  headline: 'The household derby',
  summary: 'An independently written call.',
  sections: [],
  publishedAt: '2026-09-17T10:00:00Z',
  pickRosterId: 8,
  homeProjection: 120,
  awayProjection: 110,
};
const review = {
  version: 1,
  headline: 'The verdict',
  summary: 'Our original call revisited.',
  sections: [],
  publishedAt: '2026-09-22T10:00:00Z',
};
const entries = [{ ...key, preview, review }];

void test('newsletter preserves an authored underdog call instead of choosing the projection favourite', () => {
  const saved = structuredClone(entries);
  assert.deepEqual(
    getMatchupNewsletter(key, entries, Date.parse('2026-09-17T10:00:00Z')),
    { preview, review: null },
  );
  assert.deepEqual(entries, saved);
});
void test('editions cannot leak into another week, league or fixture', () => {
  for (const change of [
    { week: 1 },
    { leagueId: 'other' },
    { season: '2027' },
    { sleeperMatchupId: 2 },
    { homeRosterId: 1 },
    { awayRosterId: 2 },
  ]) {
    assert.deepEqual(
      getMatchupNewsletter(
        { ...key, ...change },
        entries,
        Date.parse('2026-09-23T10:00:00Z'),
      ),
      { preview: null, review: null },
    );
  }
});
void test('future-dated editions stay hidden and an invalid winner is rejected', () => {
  assert.deepEqual(
    getMatchupNewsletter(key, entries, Date.parse('2026-09-17T09:59:59Z')),
    { preview: null, review: null },
  );
  assert.equal(
    getMatchupNewsletter(
      key,
      [{ ...key, preview: { ...preview, pickRosterId: 99 } }],
      Date.parse('2026-09-18T10:00:00Z'),
    ).preview,
    null,
  );
  assert.deepEqual(
    getMatchupNewsletter(key, entries, Date.parse('2026-09-23T10:00:00Z')),
    { preview, review },
  );
});
