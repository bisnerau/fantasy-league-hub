import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  weekFourReports,
  weekFourPublishedAt,
  weekFourReviewPublishedAt,
} from '../lib/data/newsletters/2026-week-4.ts';
import { getMatchupNewsletter } from '../lib/data/matchup-newsletters.ts';
import { getFlagOnThePlay } from '../lib/data/flags-on-the-play.ts';
import {
  getPowerRankingComparison,
  powerRankingEditions,
} from '../lib/data/power-rankings.ts';
import { getClubhouseEditorial } from '../lib/data/clubhouse-editorial.ts';

const read = (name) =>
  JSON.parse(
    readFileSync(new URL(`../docs/research/${name}`, import.meta.url), 'utf8'),
  );
const results = read('2026-week-4-results.json');
const rankingRows = read('2026-week-5-power-rankings.json');
const reviewAt = Date.parse(weekFourReviewPublishedAt);

const weekData = (reports, week, finalized) => ({
  leagueId: '1389706813993160704',
  season: '2026',
  week,
  finalized,
  matchups: reports.map((e) => ({
    sleeperMatchupId: e.sleeperMatchupId,
    home: { rosterId: e.homeRosterId },
    away: { rosterId: e.awayRosterId },
    preview: e.preview,
    review: e.review,
  })),
});

void test('Week 4 reviews follow settled results and leave the Friday outlooks frozen', () => {
  assert.equal(weekFourReports.length, 6);
  assert.ok(reviewAt >= Date.parse(results.retrievedAt) - 10 * 60_000);
  for (const e of weekFourReports) {
    const row = results.prediction_matchups.find(
      (r) => r.sleeper_matchup_id === e.sleeperMatchupId,
    );
    assert.equal(row.home_roster_id, e.homeRosterId);
    assert.equal(row.away_roster_id, e.awayRosterId);
    assert.equal(e.preview.publishedAt, weekFourPublishedAt);
    assert.equal(e.review.publishedAt, weekFourReviewPublishedAt);
    assert.equal(e.review.sections.length, 3);
    const home = row.home_final.toFixed(2);
    const away = row.away_final.toFixed(2);
    assert.ok(
      e.review.summary.includes(home) && e.review.summary.includes(away),
      `summary quotes both final scores for fixture ${e.sleeperMatchupId}`,
    );
    const verdict = e.review.sections.at(-1);
    const correct = e.preview.pickRosterId === row.winner_roster_id;
    if (verdict.title.startsWith('The Friday call')) {
      assert.match(verdict.title, correct ? /correct$/ : /wrong/);
    } else {
      // The Match of the Week verdict owns the missed call in its own words.
      assert.equal(correct, false);
      assert.match(e.review.headline, /Match of the Week call/);
    }
    assert.equal(getMatchupNewsletter(e, undefined, reviewAt).review, e.review);
    assert.equal(getMatchupNewsletter(e, undefined, reviewAt - 1).review, null);
  }
});

void test('the Week 4 flag goes to Burns only once Week 4 has settled', () => {
  const data = weekData(weekFourReports, 4, true);
  const flag = getFlagOnThePlay(data, undefined, reviewAt);
  assert.equal(flag.rosterId, 1);
  assert.match(flag.text, /28\.62/);
  assert.equal(
    getFlagOnThePlay({ ...data, finalized: false }, undefined, reviewAt),
    null,
  );
  assert.equal(getFlagOnThePlay(data, undefined, reviewAt - 1), null);
});

void test('the Week 5 rankings refresh the homepage while previews wait for Thursday', () => {
  const edition = powerRankingEditions.find((e) => e.week === 5);
  assert.equal(edition.throughWeek, 4);
  assert.equal(new Set(edition.entries.map((e) => e.rosterId)).size, 12);
  for (const entry of edition.entries) {
    const row = rankingRows.rows.find((r) => r.rosterId === entry.rosterId);
    assert.equal(entry.record, row.record);
    assert.equal(entry.recentPoints, row.recentPoints);
    assert.equal(row.scores.length, 4);
  }
  assert.equal(getPowerRankingComparison(edition).label, 'vs Week 4');

  const home = getClubhouseEditorial(
    weekData([], 5, false),
    weekData(weekFourReports, 4, true),
    reviewAt,
  );
  assert.equal(home.ranking, edition);
  assert.deepEqual(home.talkingPoints, edition.talkingPoints);
  assert.equal(home.previews.length, 0);
  assert.equal(home.lead.kind, 'review');
  assert.equal(home.lead.week, 4);
  assert.equal(home.reviews.length, 6);
});
