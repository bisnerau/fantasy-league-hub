import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  weekElevenReports,
  weekElevenPublishedAt,
} from '../lib/data/newsletters/2026-week-11.ts';
import { getMatchupNewsletter } from '../lib/data/matchup-newsletters.ts';
import { getMatchOfTheWeek } from '../lib/data/match-of-the-week.ts';
import {
  getClubhouseEditorial,
  getLeadBesideTicket,
} from '../lib/data/clubhouse-editorial.ts';
import { getPreviewTalkingPoints } from '../lib/data/preview-talking-points.ts';
import { sundayKickoffForWeek } from '../lib/predictions/rules.ts';
const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const evidence = read('../docs/research/2026-week-11-friday-sleeper.json');
const odds = read('../lib/data/experiments/odds-week-eleven.json');
const now = Date.parse(weekElevenPublishedAt);
const data = {
  leagueId: evidence.leagueId,
  season: evidence.season,
  week: 11,
  finalized: false,
  matchups: weekElevenReports.map((e) => ({
    sleeperMatchupId: e.sleeperMatchupId,
    home: { rosterId: e.homeRosterId },
    away: { rosterId: e.awayRosterId },
    preview: e.preview,
  })),
};
void test('Week 11 Friday stories match fresh fixtures and only appear at publication', () => {
  assert.equal(weekElevenReports.length, 6);
  assert.equal(
    new Set(weekElevenReports.map((e) => e.sleeperMatchupId)).size,
    6,
  );
  assert.ok(now >= Date.parse(evidence.retrievedAt));
  assert.ok(now > Date.parse(evidence.firstKickoff));
  assert.equal(
    sundayKickoffForWeek(2026, 11).toISOString(),
    '2026-11-22T18:00:00.000Z',
  );
  for (const e of weekElevenReports) {
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
    assert.match(e.preview.summary, /Friday.*after Indianapolis–Houston/);
    assert.equal(getMatchupNewsletter(e, undefined, now).preview, e.preview);
    assert.equal(getMatchupNewsletter(e, undefined, now - 1).preview, null);
    assert.equal(getMatchupNewsletter(e, undefined, now).review, null);
  }
  const feature = getMatchOfTheWeek(data, undefined, now);
  assert.deepEqual(
    [feature.sleeperMatchupId, feature.homeRosterId, feature.awayRosterId],
    [4, 9, 10],
  );
  assert.equal(getMatchOfTheWeek(data, undefined, now - 1), null);
  const editorial = getClubhouseEditorial(data, null, now);
  assert.equal(editorial.lead.matchup.sleeperMatchupId, 4);
  assert.notEqual(getLeadBesideTicket(editorial).matchup.sleeperMatchupId, 4);
  assert.equal(editorial.ranking.week, 11);
  assert.notDeepEqual(editorial.talkingPoints, editorial.ranking.talkingPoints);
  assert.match(
    editorial.talkingPoints[2].text,
    /18:00 Irish time on Sunday 22 November/,
  );
  assert.match(editorial.talkingPoints[2].text, /early Tuesday 24 November/);
  assert.equal(getPreviewTalkingPoints(data, now - 1), null);
  for (const changed of [
    { finalized: true },
    { week: 12 },
    { leagueId: 'other' },
    { season: '2027' },
  ])
    assert.equal(getPreviewTalkingPoints({ ...data, ...changed }, now), null);
});
void test('Week 11 prices preserve Thursday starters and exclude locked bench players and byes', () => {
  assert.equal(odds.week, 11);
  assert.equal(odds.lineupBasis, 'best');
  assert.ok(Date.parse(odds.snapshot) > Date.parse(evidence.firstKickoff));
  assert.equal(odds.matchups.length, 6);
  const round = (n) => Math.round(n * 100) / 100;
  for (const m of odds.matchups) {
    assert.deepEqual(
      m.teams.map((t) => t.id),
      evidence.teams.filter((t) => t.matchupId === m.id).map((t) => t.rosterId),
    );
    for (const t of m.teams) {
      const source = evidence.teams.find((s) => s.rosterId === t.id);
      const locked = source.starters.filter((p) => p.date === '2026-11-19');
      assert.equal(t.banked, source.points);
      assert.equal(t.banked, round(locked.reduce((s, p) => s + p.points, 0)));
      assert.equal(t.adjustedLineup.length, 9);
      assert.equal(new Set(t.adjustedLineup.map((p) => p.name)).size, 9);
      assert.deepEqual(
        t.adjustedLineup
          .filter((p) => p.locked)
          .map((p) => p.name)
          .sort(),
        locked.map((p) => p.name).sort(),
      );
      for (const p of t.adjustedLineup) {
        const original = [...source.starters, ...source.bench].find(
          (o) => o.name === p.name,
        );
        assert.ok(original, p.name);
        if (p.locked) {
          assert.equal(p.points, original.points);
          assert.equal(p.fromBench, false);
        } else {
          assert.ok(
            !['Out', 'IR', 'PUP', 'Sus'].includes(original.status),
            p.name,
          );
          assert.notEqual(original.ppr, null, p.name);
          assert.ok(original.date > '2026-11-19', p.name);
        }
      }
      assert.equal(
        t.adjustedTotal,
        round(t.adjustedLineup.reduce((s, p) => s + p.points, 0)),
      );
    }
  }
  const teams = odds.matchups.flatMap((m) => m.teams);
  const has = (id, name) =>
    teams.find((t) => t.id === id).adjustedLineup.some((p) => p.name === name);
  assert.ok(!has(4, 'Tank Dell'));
  assert.ok(!has(5, 'Bijan Robinson'));
  assert.ok(!has(10, 'Puka Nacua'));
  assert.ok(!has(10, 'Jaxon Smith-Njigba'));
  assert.ok(has(2, 'Kenneth Walker III'));
  assert.ok(has(8, 'Ladd McConkey'));
  assert.ok(has(9, 'Dalton Kincaid'));
  assert.ok(has(9, 'Matt Gay'));
});
