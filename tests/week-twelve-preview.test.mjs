import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { isThanksgivingWeek } from '../lib/data/thanksgiving-week.ts';
import {
  weekTwelveReports,
  weekTwelvePublishedAt,
} from '../lib/data/newsletters/2026-week-12.ts';
import { getMatchupNewsletter } from '../lib/data/matchup-newsletters.ts';
import { getMatchOfTheWeek } from '../lib/data/match-of-the-week.ts';
import {
  getClubhouseEditorial,
  getLeadBesideTicket,
} from '../lib/data/clubhouse-editorial.ts';
import { getPreviewTalkingPoints } from '../lib/data/preview-talking-points.ts';
import { sundayKickoffForWeek } from '../lib/predictions/rules.ts';
const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const evidence = read(
  '../docs/research/2026-week-12-thanksgiving-sleeper.json',
);
const odds = read('../lib/data/experiments/odds-week-twelve.json');
const now = Date.parse(weekTwelvePublishedAt);
const data = {
  leagueId: evidence.leagueId,
  season: evidence.season,
  week: 12,
  finalized: false,
  matchups: weekTwelveReports.map((e) => ({
    sleeperMatchupId: e.sleeperMatchupId,
    home: { rosterId: e.homeRosterId },
    away: { rosterId: e.awayRosterId },
    preview: e.preview,
  })),
};
void test('Week 12 Thanksgiving stories match fresh fixtures and only appear at publication', () => {
  assert.equal(weekTwelveReports.length, 6);
  assert.equal(
    new Set(weekTwelveReports.map((e) => e.sleeperMatchupId)).size,
    6,
  );
  assert.ok(now >= Date.parse(evidence.retrievedAt));
  assert.ok(now > Date.parse(evidence.firstKickoff));
  assert.equal(
    sundayKickoffForWeek(2026, 12).toISOString(),
    '2026-11-29T18:00:00.000Z',
  );
  for (const e of weekTwelveReports) {
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
    assert.match(
      e.preview.summary,
      /Thanksgiving.*after Green Bay–Los Angeles/,
    );
    assert.equal(getMatchupNewsletter(e, undefined, now).preview, e.preview);
    assert.equal(getMatchupNewsletter(e, undefined, now - 1).preview, null);
    assert.equal(getMatchupNewsletter(e, undefined, now).review, null);
  }
  const feature = getMatchOfTheWeek(data, undefined, now);
  assert.deepEqual(
    [feature.sleeperMatchupId, feature.homeRosterId, feature.awayRosterId],
    [2, 1, 7],
  );
  assert.equal(getMatchOfTheWeek(data, undefined, now - 1), null);
  const editorial = getClubhouseEditorial(data, null, now);
  assert.equal(editorial.lead.matchup.sleeperMatchupId, 2);
  assert.notEqual(getLeadBesideTicket(editorial).matchup.sleeperMatchupId, 2);
  assert.equal(editorial.ranking.week, 12);
  assert.notDeepEqual(editorial.talkingPoints, editorial.ranking.talkingPoints);
  assert.match(
    editorial.talkingPoints[2].text,
    /18:00 Irish time on Sunday 29 November/,
  );
  assert.match(editorial.talkingPoints[2].text, /01:20 Friday/);
  assert.equal(getPreviewTalkingPoints(data, now - 1), null);
  for (const changed of [
    { finalized: true },
    { week: 13 },
    { leagueId: 'other' },
    { season: '2027' },
  ])
    assert.equal(getPreviewTalkingPoints({ ...data, ...changed }, now), null);
});
void test('Week 12 prices preserve Wednesday starters and exclude locked bench players and byes', () => {
  assert.equal(odds.week, 12);
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
      const locked = source.starters.filter((p) => p.date === '2026-11-25');
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
          assert.ok(original.date > '2026-11-25', p.name);
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
  assert.ok(!has(4, 'Matthew Stafford'));
  assert.ok(!has(7, 'Green Bay Packers'));
  assert.ok(!has(2, 'Kenneth Walker III'));
  assert.ok(!has(3, 'Josh Jacobs'));
  assert.ok(has(3, 'Christian Watson'));
  assert.ok(has(5, 'Blake Corum'));
});

void test('Thanksgiving banner expires and never decorates other weeks or leagues', () => {
  assert.equal(isThanksgivingWeek(data, now), true);
  assert.equal(
    isThanksgivingWeek(data, Date.parse('2026-11-25T23:59:59Z')),
    false,
  );
  assert.equal(
    isThanksgivingWeek(data, Date.parse('2026-12-01T10:59:59Z')),
    true,
  );
  assert.equal(
    isThanksgivingWeek(data, Date.parse('2026-12-01T11:00:00Z')),
    false,
  );
  for (const changed of [
    { finalized: true },
    { week: 11 },
    { week: 13 },
    { season: '2027' },
    { leagueId: 'other' },
  ])
    assert.equal(isThanksgivingWeek({ ...data, ...changed }, now), false);
});
