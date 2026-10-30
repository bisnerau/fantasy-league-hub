import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  weekEightReports,
  weekEightPublishedAt,
} from '../lib/data/newsletters/2026-week-8.ts';
import { getMatchupNewsletter } from '../lib/data/matchup-newsletters.ts';
import { getMatchOfTheWeek } from '../lib/data/match-of-the-week.ts';
import {
  getClubhouseEditorial,
  getLeadBesideTicket,
} from '../lib/data/clubhouse-editorial.ts';
import { getPreviewTalkingPoints } from '../lib/data/preview-talking-points.ts';
const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const evidence = read('../docs/research/2026-week-8-sleeper.json');
const odds = read('../lib/data/experiments/odds-week-eight.json');
const now = Date.parse(weekEightPublishedAt);
const data = {
  leagueId: evidence.leagueId,
  season: evidence.season,
  week: 8,
  finalized: false,
  matchups: weekEightReports.map((e) => ({
    sleeperMatchupId: e.sleeperMatchupId,
    home: { rosterId: e.homeRosterId },
    away: { rosterId: e.awayRosterId },
    preview: e.preview,
  })),
};
void test('Week 8 Friday previews preserve verified fixtures, original estimates and publication gates', () => {
  assert.equal(weekEightReports.length, 6);
  assert.equal(
    new Set(weekEightReports.map((e) => e.sleeperMatchupId)).size,
    6,
  );
  assert.ok(now >= Date.parse(evidence.retrievedAt));
  assert.ok(now > Date.parse(evidence.firstKickoff));
  for (const e of weekEightReports) {
    const pair = evidence.teams.filter(
      (t) => t.matchupId === e.sleeperMatchupId,
    );
    assert.deepEqual(
      [e.homeRosterId, e.awayRosterId],
      pair.map((t) => t.rosterId),
    );
    assert.equal(e.preview.homeProjection, pair[0].pprTotal);
    assert.equal(e.preview.awayProjection, pair[1].pprTotal);
    assert.ok(pair.some((t) => t.rosterId === e.preview.pickRosterId));
    assert.match(e.preview.summary, /Friday/);
    assert.match(e.preview.sections.at(-1).title, /Friday call/);
    assert.equal(getMatchupNewsletter(e, undefined, now).preview, e.preview);
    assert.equal(getMatchupNewsletter(e, undefined, now - 1).preview, null);
    assert.equal(getMatchupNewsletter(e, undefined, now).review, null);
  }
});
void test('Week 8 homepage features the final rematch without duplicating its lead or changing the ranking archive', () => {
  const feature = getMatchOfTheWeek(data, undefined, now);
  assert.equal(feature.sleeperMatchupId, 3);
  assert.deepEqual([feature.homeRosterId, feature.awayRosterId], [5, 6]);
  assert.match(feature.reason, /Friday selection, after Thursday/);
  assert.equal(getMatchOfTheWeek(data, undefined, now - 1), null);
  const editorial = getClubhouseEditorial(data, null, now);
  assert.equal(editorial.lead.matchup.sleeperMatchupId, 3);
  assert.notEqual(getLeadBesideTicket(editorial).matchup.sleeperMatchupId, 3);
  assert.equal(editorial.ranking.week, 8);
  assert.notDeepEqual(editorial.talkingPoints, editorial.ranking.talkingPoints);
  assert.match(editorial.talkingPoints[2].text, /18:00/);
  assert.equal(getPreviewTalkingPoints(data, now - 1), null);
  for (const changed of [
    { finalized: true },
    { week: 9 },
    { leagueId: 'other' },
    { season: '2027' },
  ])
    assert.equal(getPreviewTalkingPoints({ ...data, ...changed }, now), null);
});
void test('Week 8 prices include current trade ownership, available bench cover and only locked starter scores', () => {
  assert.equal(odds.week, 8);
  assert.equal(odds.lineupBasis, 'best');
  assert.equal(odds.matchups.length, 6);
  for (const m of odds.matchups) {
    assert.deepEqual(
      m.teams.map((t) => t.id),
      evidence.teams.filter((t) => t.matchupId === m.id).map((t) => t.rosterId),
    );
    for (const t of m.teams) {
      const source = evidence.teams.find((e) => e.rosterId === t.id);
      assert.equal(t.banked, source.points);
      assert.equal(t.adjustedLineup.length, 9);
      assert.equal(new Set(t.adjustedLineup.map((p) => p.name)).size, 9);
      for (const p of t.adjustedLineup) {
        const original = [...source.starters, ...source.bench].find(
          (o) => o.name === p.name,
        );
        assert.ok(original, p.name);
        if (p.locked) {
          assert.ok(source.starters.includes(original));
          assert.equal(p.points, original.points);
        } else {
          assert.ok(
            !['Out', 'IR', 'PUP', 'Sus'].includes(original.status),
            p.name,
          );
          assert.notEqual(original.ppr, null, p.name);
        }
      }
      assert.equal(
        t.adjustedTotal,
        Math.round(t.adjustedLineup.reduce((s, p) => s + p.points, 0) * 100) /
          100,
      );
    }
  }
  const teams = odds.matchups.flatMap((m) => m.teams);
  const has = (id, name) =>
    teams.find((t) => t.id === id).adjustedLineup.some((p) => p.name === name);
  for (const [id, name] of [
    [9, 'Justin Jefferson'],
    [7, 'Emeka Egbuka'],
    [10, 'Dallas Goedert'],
    [6, 'Brock Bowers'],
    [6, 'Chase Brown'],
    [8, 'Tucker Kraft'],
    [8, 'Javonte Williams'],
    [2, 'Pat Freiermuth'],
    [9, 'Pittsburgh Steelers'],
  ])
    assert.ok(has(id, name), `${id}: ${name}`);
  assert.ok(!has(7, 'Justin Jefferson'));
  assert.ok(!has(2, 'Dallas Goedert'));
  assert.ok(!has(11, 'Jordan Love'));
  assert.equal(
    evidence.teams
      .find((t) => t.rosterId === 7)
      .starters.filter((p) => p.id === '0').length,
    1,
  );
  assert.ok(has(7, 'Emeka Egbuka'));
});
