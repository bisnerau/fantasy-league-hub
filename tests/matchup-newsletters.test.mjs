import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { getMatchupNewsletter } from '../lib/data/matchup-newsletters.ts';
import { weekTwoReports } from '../lib/data/newsletters/2026-week-2.ts';
import { readPreview } from '../lib/predictions/stories.ts';

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

void test('all six Week 2 previews match the researched fixtures and preserve the original PPR snapshot', () => {
  const snapshot = JSON.parse(
    readFileSync(
      new URL('../docs/research/2026-week-2-sleeper.json', import.meta.url),
      'utf8',
    ),
  );
  assert.equal(weekTwoReports.length, 6);
  assert.equal(new Set(weekTwoReports.map((e) => e.sleeperMatchupId)).size, 6);
  for (const edition of weekTwoReports) {
    const pair = snapshot.teams.filter(
      (t) => t.matchupId === edition.sleeperMatchupId,
    );
    assert.deepEqual(
      pair.map((t) => t.rosterId),
      [edition.homeRosterId, edition.awayRosterId],
    );
    const p = edition.preview;
    assert.equal(edition.leagueId, snapshot.leagueId);
    assert.equal(edition.season, snapshot.season);
    assert.equal(edition.week, snapshot.week);
    assert.ok(Date.parse(p.publishedAt) >= Date.parse(snapshot.retrievedAt));
    assert.ok(Date.parse(p.publishedAt) < Date.parse(snapshot.firstKickoff));
    assert.equal(p.homeProjection, pair[0].pprTotal);
    assert.equal(p.awayProjection, pair[1].pprTotal);
    assert.ok(pair.some((t) => t.rosterId === p.pickRosterId));
    assert.equal(p.editorial, true);
    assert.equal(edition.review, undefined);
    assert.deepEqual(readPreview(p), p);
    assert.deepEqual(
      getMatchupNewsletter(edition, undefined, Date.parse(p.publishedAt))
        .preview,
      p,
    );
  }
});

void test('preview sources accept HTTPS links and reject malformed archived values', () => {
  const p = {
    ...preview,
    sources: [
      { label: 'Official report', url: 'https://www.nfl.com/injuries/' },
    ],
  };
  assert.deepEqual(readPreview(p), p);
  for (const sources of [
    null,
    {},
    [null],
    [{ label: 'Broken' }],
    [{ label: 'Unsafe', url: 'javascript:alert(1)' }],
  ]) {
    assert.equal(readPreview({ ...p, sources }), null);
  }
});

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
