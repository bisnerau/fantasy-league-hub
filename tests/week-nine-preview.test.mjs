import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  weekNineReports,
  weekNinePublishedAt,
} from '../lib/data/newsletters/2026-week-9.ts';
import { getMatchupNewsletter } from '../lib/data/matchup-newsletters.ts';
import { getMatchOfTheWeek } from '../lib/data/match-of-the-week.ts';
import {
  getClubhouseEditorial,
  getLeadBesideTicket,
} from '../lib/data/clubhouse-editorial.ts';
import { getPreviewTalkingPoints } from '../lib/data/preview-talking-points.ts';
const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const evidence = read('../docs/research/2026-week-9-sleeper.json');
const odds = read('../lib/data/experiments/odds-week-nine.json');
const now = Date.parse(weekNinePublishedAt);
const data = {
  leagueId: evidence.leagueId,
  season: evidence.season,
  week: 9,
  finalized: false,
  matchups: weekNineReports.map((e) => ({
    sleeperMatchupId: e.sleeperMatchupId,
    home: { rosterId: e.homeRosterId },
    away: { rosterId: e.awayRosterId },
    preview: e.preview,
  })),
};
void test('Week 9 edition agrees with the source fixtures and preserves publication boundaries', () => {
  assert.equal(weekNineReports.length, 6);
  assert.equal(new Set(weekNineReports.map((e) => e.sleeperMatchupId)).size, 6);
  assert.ok(now >= Date.parse(evidence.retrievedAt));
  assert.ok(now > Date.parse(evidence.firstKickoff));
  for (const e of weekNineReports) {
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
    assert.match(e.preview.summary, /Friday.*after Jacksonville–Baltimore/);
    assert.equal(getMatchupNewsletter(e, undefined, now).preview, e.preview);
    assert.equal(getMatchupNewsletter(e, undefined, now - 1).preview, null);
    assert.equal(getMatchupNewsletter(e, undefined, now).review, null);
  }
  const feature = getMatchOfTheWeek(data, undefined, now);
  assert.deepEqual(
    [feature.sleeperMatchupId, feature.homeRosterId, feature.awayRosterId],
    [2, 6, 9],
  );
  const editorial = getClubhouseEditorial(data, null, now);
  assert.equal(editorial.lead.matchup.sleeperMatchupId, 2);
  assert.notEqual(getLeadBesideTicket(editorial).matchup.sleeperMatchupId, 2);
  assert.equal(editorial.ranking.week, 9);
  assert.notDeepEqual(editorial.talkingPoints, editorial.ranking.talkingPoints);
  assert.match(
    editorial.talkingPoints[2].text,
    /18:00 Irish time on 8 November/,
  );
  for (const changed of [
    { finalized: true },
    { week: 10 },
    { leagueId: 'other' },
    { season: '2027' },
  ])
    assert.equal(getPreviewTalkingPoints({ ...data, ...changed }, now), null);
});
void test('Week 9 prices preserve locked starters, exclude unavailable bench players and expose Keenan’s genuine gap', () => {
  assert.equal(odds.week, 9);
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
      assert.equal(t.adjustedLineup.length, t.id === 3 ? 8 : 9);
      assert.equal(
        new Set(t.adjustedLineup.map((p) => p.name)).size,
        t.adjustedLineup.length,
      );
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
  assert.ok(!has(3, 'Terrance Ferguson'));
  assert.ok(has(4, 'Rhamondre Stevenson'));
  assert.ok(!has(4, 'A.J. Brown'));
  assert.ok(has(8, 'Patrick Mahomes'));
  assert.ok(!has(6, 'Chris Rodriguez Jr.'));
  assert.ok(!has(7, 'Baltimore Ravens'));
});
