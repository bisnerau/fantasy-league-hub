import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  weekTenReports,
  weekTenPublishedAt,
} from '../lib/data/newsletters/2026-week-10.ts';
import { getMatchupNewsletter } from '../lib/data/matchup-newsletters.ts';
import { getMatchOfTheWeek } from '../lib/data/match-of-the-week.ts';
import {
  getClubhouseEditorial,
  getLeadBesideTicket,
} from '../lib/data/clubhouse-editorial.ts';
import { getPreviewTalkingPoints } from '../lib/data/preview-talking-points.ts';
const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const evidence = read('../docs/research/2026-week-10-sleeper.json');
const odds = read('../lib/data/experiments/odds-week-ten.json');
const now = Date.parse(weekTenPublishedAt);
const data = {
  leagueId: evidence.leagueId,
  season: evidence.season,
  week: 10,
  finalized: false,
  matchups: weekTenReports.map((e) => ({
    sleeperMatchupId: e.sleeperMatchupId,
    home: { rosterId: e.homeRosterId },
    away: { rosterId: e.awayRosterId },
    preview: e.preview,
  })),
};
void test('Week 10 Thursday edition matches all public fixtures and appears before first kickoff', () => {
  assert.equal(weekTenReports.length, 6);
  assert.equal(new Set(weekTenReports.map((e) => e.sleeperMatchupId)).size, 6);
  assert.ok(now >= Date.parse(evidence.retrievedAt));
  assert.ok(now < Date.parse(evidence.firstKickoff));
  for (const e of weekTenReports) {
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
    assert.match(e.preview.summary, /Thursday.*before Washington–New York/);
    assert.equal(getMatchupNewsletter(e, undefined, now).preview, e.preview);
    assert.equal(getMatchupNewsletter(e, undefined, now - 1).preview, null);
    assert.equal(getMatchupNewsletter(e, undefined, now).review, null);
  }
  const feature = getMatchOfTheWeek(data, undefined, now);
  assert.deepEqual(
    [feature.sleeperMatchupId, feature.homeRosterId, feature.awayRosterId],
    [4, 1, 2],
  );
  const editorial = getClubhouseEditorial(data, null, now);
  assert.equal(editorial.lead.matchup.sleeperMatchupId, 4);
  assert.notEqual(getLeadBesideTicket(editorial).matchup.sleeperMatchupId, 4);
  assert.equal(editorial.ranking.week, 10);
  assert.notDeepEqual(editorial.talkingPoints, editorial.ranking.talkingPoints);
  assert.match(
    editorial.talkingPoints[2].text,
    /18:00 Irish time on 15 November/,
  );
  assert.match(editorial.talkingPoints[2].text, /before Washington–New York/);
  for (const changed of [
    { finalized: true },
    { week: 11 },
    { leagueId: 'other' },
    { season: '2027' },
  ])
    assert.equal(getPreviewTalkingPoints({ ...data, ...changed }, now), null);
});
void test('Week 10 early prices have no banked scores and use nine eligible players per team', () => {
  assert.equal(odds.week, 10);
  assert.equal(odds.lineupBasis, 'best');
  assert.ok(Date.parse(odds.snapshot) < Date.parse(evidence.firstKickoff));
  assert.equal(odds.matchups.length, 6);
  for (const m of odds.matchups) {
    assert.deepEqual(
      m.teams.map((t) => t.id),
      evidence.teams.filter((t) => t.matchupId === m.id).map((t) => t.rosterId),
    );
    for (const t of m.teams) {
      const source = evidence.teams.find((e) => e.rosterId === t.id);
      assert.equal(t.banked, 0);
      assert.equal(t.adjustedLineup.length, 9);
      assert.equal(new Set(t.adjustedLineup.map((p) => p.name)).size, 9);
      for (const p of t.adjustedLineup) {
        const original = [...source.starters, ...source.bench].find(
          (o) => o.name === p.name,
        );
        assert.ok(original, p.name);
        assert.equal(p.locked, false);
        assert.ok(
          !['Out', 'IR', 'PUP', 'Sus'].includes(original.status),
          p.name,
        );
        assert.notEqual(original.ppr, null, p.name);
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
  assert.ok(!has(4, 'Puka Nacua'));
  assert.ok(!has(4, 'Bucky Irving'));
  assert.ok(!has(3, 'Josh Jacobs'));
  assert.ok(!has(3, 'Saquon Barkley'));
  assert.ok(has(3, 'Chig Okonkwo'));
  assert.ok(!has(12, 'Travis Etienne Jr.'));
  assert.ok(has(12, 'DK Metcalf'));
});
