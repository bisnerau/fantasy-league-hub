import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import {
  powerRankingEditions,
  getPowerRankingEditions,
  getPowerRankingComparison,
  getMarketMovers,
  getMarketReport,
  getRankHistory,
  getRankMoves,
  ordinal,
  parseRecord,
} from '../lib/data/power-rankings.ts';
import { draftRecapContent } from '../lib/data/draft-recap-content.ts';
import { getClubhouseEditorial } from '../lib/data/clubhouse-editorial.ts';
import { getLatestAuthoredReviewWeek } from '../lib/data/matchup-newsletters.ts';
import { weekTwoReports } from '../lib/data/newsletters/2026-week-2.ts';

const edition = powerRankingEditions[0];
const now = Date.parse('2026-09-17T23:00:00Z');
const data = {
  leagueId: edition.leagueId,
  season: '2026',
  week: 2,
  finalized: false,
  matchups: weekTwoReports.map((e) => ({
    sleeperMatchupId: e.sleeperMatchupId,
    home: { rosterId: e.homeRosterId },
    away: { rosterId: e.awayRosterId },
    preview: e.preview,
  })),
};
const review = {
  headline: 'A settled report',
  summary: 'Review text',
  sections: [],
};
const reviewData = {
  ...data,
  week: 1,
  finalized: true,
  matchups: [{ ...data.matchups[0], review }],
};

void test('the first rankings contain all twelve verified records and an honest preseason baseline', () => {
  const snapshot = JSON.parse(
    readFileSync(
      new URL(
        '../docs/research/2026-week-2-power-rankings.json',
        import.meta.url,
      ),
      'utf8',
    ),
  );
  assert.equal(edition.entries.length, 12);
  assert.equal(new Set(edition.entries.map((e) => e.rosterId)).size, 12);
  assert.equal(edition.talkingPoints.length, 3);
  assert.ok(
    Date.parse(edition.publishedAt) >= Date.parse(snapshot.retrievedAt),
  );
  for (const row of edition.entries) {
    const source = snapshot.rows.find((r) => r.rosterId === row.rosterId);
    assert.equal(row.recentPoints, source.week1Score);
    assert.equal(row.record, source.record);
  }
  const comparison = getPowerRankingComparison(edition);
  assert.equal(comparison.label, 'vs preseason forecast');
  for (const row of draftRecapContent.entries)
    assert.equal(comparison.ranks.get(row.rosterId), row.predictedFinish);
  assert.equal(comparison.ranks.get(2) - 1, 4);
});

void test('future and other-league ranking editions stay hidden and archive order is stable', () => {
  assert.deepEqual(
    getPowerRankingEditions(
      edition.leagueId,
      '2026',
      Date.parse(edition.publishedAt) - 1,
    ),
    [],
  );
  assert.deepEqual(getPowerRankingEditions('other-league', '2026', now), []);
  assert.deepEqual(getPowerRankingEditions(edition.leagueId, '2027', now), []);
  assert.deepEqual(getPowerRankingEditions(edition.leagueId, '2026', now), [
    edition,
  ]);
});

void test('later movement uses the previous published weekly list, never future rankings or another season', () => {
  const next = {
    ...edition,
    week: 3,
    publishedAt: '2026-09-24T10:00:00Z',
    entries: [...edition.entries].reverse(),
  };
  const future = { ...edition, week: 4, publishedAt: '2026-10-01T10:00:00Z' };
  const foreign = { ...edition, leagueId: 'other-league' };
  const comparison = getPowerRankingComparison(next, [
    future,
    foreign,
    next,
    edition,
  ]);
  assert.equal(comparison.label, 'vs Week 2');
  assert.equal(comparison.href, '/power-rankings?season=2026&week=2');
  assert.equal(comparison.ranks.get(edition.entries[0].rosterId), 1);
  assert.equal(comparison.ranks.get(edition.entries[11].rosterId), 12);
});

void test('the homepage features the selected preview and only advertises settled reviews', () => {
  const home = getClubhouseEditorial(data, reviewData, now);
  assert.equal(home.lead.matchup.sleeperMatchupId, 4);
  assert.equal(home.lead.featured, true);
  assert.equal(home.lead.kind, 'preview');
  assert.equal(home.lead.week, 2);
  assert.equal(home.previews.length, 6);
  assert.equal(home.reviews.length, 1);
  assert.equal(home.talkingPoints.length, 3);
  assert.equal(getLatestAuthoredReviewWeek(data, now), 1);
  for (const change of [
    { finalized: false },
    { leagueId: 'other-league' },
    { season: '2025' },
    { week: 3 },
  ]) {
    assert.equal(
      getClubhouseEditorial(data, { ...reviewData, ...change }, now).reviews
        .length,
      0,
    );
  }
});

void test('a later week uses the actual archived report week and does not recycle old talking points', () => {
  const home = getClubhouseEditorial(
    { ...data, week: 3, matchups: [] },
    reviewData,
    now,
  );
  assert.equal(home.lead.week, 1);
  assert.equal(home.lead.kind, 'review');
  assert.equal(home.lead.featured, false);
  assert.deepEqual(home.talkingPoints, []);
  assert.equal(home.ranking.week, 2);
  const awaitingReview = getClubhouseEditorial(
    { ...data, finalized: true },
    reviewData,
    now,
  );
  assert.equal(awaitingReview.lead.week, 1);
  assert.equal(awaitingReview.lead.kind, 'review');
  const final = getClubhouseEditorial(
    {
      ...data,
      finalized: true,
      matchups: data.matchups.map((m) => ({ ...m, review })),
    },
    reviewData,
    now,
  );
  assert.equal(final.lead.week, 2);
  assert.equal(final.lead.kind, 'review');
  assert.equal(final.lead.featured, true);
});

const weekThree = powerRankingEditions.find((e) => e.week === 3);
const movesFor = (e, editions = powerRankingEditions) =>
  getRankMoves(e, getPowerRankingComparison(e, editions));

void test('records and ordinals parse the edition formats', () => {
  assert.deepEqual(parseRecord('2–0'), { wins: 2, losses: 0, ties: 0 });
  assert.deepEqual(parseRecord('1-1-1'), { wins: 1, losses: 1, ties: 1 });
  assert.deepEqual(parseRecord('0–0'), { wins: 0, losses: 0, ties: 0 });
  assert.deepEqual([1, 2, 3, 4, 11, 12, 13, 21, 22].map(ordinal), [
    '1st',
    '2nd',
    '3rd',
    '4th',
    '11th',
    '12th',
    '13th',
    '21st',
    '22nd',
  ]);
});

void test('movement follows the comparison: preseason for Week 2, Week 2 for Week 3', () => {
  const two = movesFor(edition);
  assert.deepEqual(two[0], {
    rosterId: 2,
    rank: 1,
    previousRank: 5,
    change: 4,
  });
  const three = movesFor(weekThree);
  const jack = three.find((m) => m.rosterId === 9);
  assert.equal(jack.previousRank, 8);
  assert.equal(jack.change, 5);
  const first = getRankMoves(edition, { ranks: new Map() });
  assert.ok(first.every((m) => m.previousRank === undefined));
  assert.deepEqual(getMarketMovers(first), {
    riser: undefined,
    faller: undefined,
  });
});

void test('market movers break ties by the better current rank', () => {
  // Niall (5th to 1st) and Hugo (11th to 7th) both rose four places.
  const { riser, faller } = getMarketMovers(movesFor(edition));
  assert.equal(riser.rosterId, 2);
  assert.equal(faller.rosterId, 7);
  const unchanged = getRankMoves(edition, {
    ranks: new Map(edition.entries.map((e, i) => [e.rosterId, i + 1])),
  });
  assert.deepEqual(getMarketMovers(unchanged), {
    riser: undefined,
    faller: undefined,
  });
});

void test('the Week 3 market report uses only edition records and movement', () => {
  const report = getMarketReport(weekThree, movesFor(weekThree));
  assert.deepEqual(
    report.map((item) => [item.key, item.rosterId]),
    [
      ['riser', 9],
      ['faller', 1],
      ['unbeaten', 11],
      ['winless', 7],
    ],
  );
  assert.equal(report[2].value, '2–0 and ranked 11th');
  assert.equal(report[3].value, '0–2 and ranked 8th');
});

void test('record cards hide when the order already agrees with the records', () => {
  const sorted = {
    ...weekThree,
    entries: [...weekThree.entries].sort(
      (a, b) => parseRecord(b.record).wins - parseRecord(a.record).wins,
    ),
  };
  const keys = getMarketReport(
    sorted,
    getRankMoves(sorted, { ranks: new Map() }),
  ).map((item) => item.key);
  assert.deepEqual(keys, []);
  const unplayed = {
    ...weekThree,
    entries: weekThree.entries.map((e) => ({ ...e, record: '0–0' })),
  };
  assert.deepEqual(
    getMarketReport(unplayed, getRankMoves(unplayed, { ranks: new Map() })),
    [],
  );
});

void test('rank history starts at the preseason forecast and leaves unpublished weeks as gaps', () => {
  const at = Date.parse('2026-10-20T00:00:00Z');
  const history = getRankHistory(edition.leagueId, '2026', at);
  assert.deepEqual(
    history.columns.map((c) => c.label),
    ['Pre', 'W2', 'W3'],
  );
  assert.deepEqual(history.series.get(1), [2, 4, 9]);
  const five = {
    ...weekThree,
    week: 5,
    publishedAt: '2026-10-08T10:00:00Z',
  };
  const gapped = getRankHistory(edition.leagueId, '2026', at, [
    edition,
    weekThree,
    five,
  ]);
  assert.deepEqual(
    gapped.columns.map((c) => [c.label, c.published]),
    [
      ['Pre', true],
      ['W2', true],
      ['W3', true],
      ['W4', false],
      ['W5', true],
    ],
  );
  assert.deepEqual(gapped.series.get(1), [2, 4, 9, null, 9]);
  assert.deepEqual(
    getRankHistory(
      edition.leagueId,
      '2026',
      Date.parse(edition.publishedAt) - 1,
    ).columns,
    [],
  );
  assert.equal(getRankHistory('other-league', '2026', at).columns.length, 0);
});
