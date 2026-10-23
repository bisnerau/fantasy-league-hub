import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  weekSevenReports,
  weekSevenPublishedAt,
  weekSevenFeatureUpdatedAt,
} from '../lib/data/newsletters/2026-week-7.ts';
import { getMatchupNewsletter } from '../lib/data/matchup-newsletters.ts';
import { getMatchOfTheWeek } from '../lib/data/match-of-the-week.ts';
import {
  getClubhouseEditorial,
  getLeadBesideTicket,
} from '../lib/data/clubhouse-editorial.ts';
import { getPreviewTalkingPoints } from '../lib/data/preview-talking-points.ts';

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const evidence = read('../docs/research/2026-week-7-sleeper.json');
const odds = read('../lib/data/experiments/odds-week-seven.json');
const now = Date.parse(weekSevenPublishedAt);
const data = {
  leagueId: evidence.leagueId,
  season: evidence.season,
  week: 7,
  finalized: false,
  matchups: weekSevenReports.map((entry) => ({
    sleeperMatchupId: entry.sleeperMatchupId,
    home: { rosterId: entry.homeRosterId },
    away: { rosterId: entry.awayRosterId },
    preview: entry.preview,
  })),
};

void test('Week 7 reports match the verified ballot, projections and Friday cutoff', () => {
  assert.equal(weekSevenReports.length, 6);
  assert.equal(
    new Set(weekSevenReports.map((e) => e.sleeperMatchupId)).size,
    6,
  );
  assert.ok(now >= Date.parse(evidence.retrievedAt));
  assert.ok(now > Date.parse(evidence.firstKickoff));
  for (const entry of weekSevenReports) {
    const pair = evidence.teams.filter(
      (t) => t.matchupId === entry.sleeperMatchupId,
    );
    assert.deepEqual(
      pair.map((t) => t.rosterId),
      [entry.homeRosterId, entry.awayRosterId],
    );
    assert.equal(entry.preview.homeProjection, pair[0].pprTotal);
    assert.equal(entry.preview.awayProjection, pair[1].pprTotal);
    assert.ok(pair.some((t) => t.rosterId === entry.preview.pickRosterId));
    assert.match(entry.preview.summary, /Friday/);
    assert.match(entry.preview.sections.at(-1).title, /Friday call/);
    assert.equal(
      getMatchupNewsletter(entry, undefined, now).preview,
      entry.preview,
    );
    assert.equal(getMatchupNewsletter(entry, undefined, now - 1).preview, null);
    assert.equal(getMatchupNewsletter(entry, undefined, now).review, null);
  }
});

void test('the corrected Friday homepage features Tommy–Hugo and retires talking points on settlement', () => {
  const featureNow = Date.parse(weekSevenFeatureUpdatedAt);
  const featured = getMatchOfTheWeek(data, undefined, featureNow);
  assert.equal(featured.sleeperMatchupId, 3);
  assert.equal(featured.homeRosterId, 4);
  assert.equal(featured.awayRosterId, 8);
  assert.match(featured.reason, /Friday selection, after Thursday/);
  const home = getClubhouseEditorial(data, null, featureNow);
  assert.equal(home.lead.matchup.sleeperMatchupId, 3);
  assert.equal(getLeadBesideTicket(home).matchup.sleeperMatchupId, 1);
  assert.equal(home.ranking.week, 7);
  assert.notDeepEqual(home.talkingPoints, home.ranking.talkingPoints);
  assert.match(home.talkingPoints[0].title, /First trade/);
  assert.equal(getPreviewTalkingPoints(data, now - 1), null);
  for (const changed of [
    { finalized: true },
    { week: 8 },
    { leagueId: 'other' },
    { season: '2027' },
  ]) {
    assert.equal(getPreviewTalkingPoints({ ...data, ...changed }, now), null);
  }
});

void test('prices use post-trade rosters, fixed Thursday points and honest unfilled slots', () => {
  assert.equal(odds.week, 7);
  assert.equal(odds.lineupBasis, 'best');
  assert.equal(odds.matchups.length, 6);
  for (const match of odds.matchups) {
    assert.deepEqual(
      match.teams.map((t) => t.id),
      evidence.teams
        .filter((t) => t.matchupId === match.id)
        .map((t) => t.rosterId),
    );
    for (const team of match.teams) {
      const source = evidence.teams.find((t) => t.rosterId === team.id);
      const players = [...source.starters, ...source.bench];
      for (const player of team.adjustedLineup) {
        const original = players.find(
          (p) =>
            p.name === player.name ||
            (p.position === 'DEF' && player.position === 'DEF'),
        );
        assert.ok(original, player.name);
        if (player.locked) {
          assert.ok(source.starters.includes(original));
          assert.equal(player.points, original.points);
        } else {
          assert.ok(
            !['Out', 'IR', 'PUP', 'Sus'].includes(original.status),
            player.name,
          );
        }
      }
      assert.equal(
        team.adjustedTotal,
        Math.round(
          team.adjustedLineup.reduce((sum, p) => sum + p.points, 0) * 100,
        ) / 100,
      );
      assert.equal(team.banked, source.points);
    }
  }
  const teams = odds.matchups.flatMap((m) => m.teams);
  const has = (id, name) =>
    teams.find((t) => t.id === id).adjustedLineup.some((p) => p.name === name);
  assert.ok(has(5, 'Garrett Wilson'));
  assert.ok(!has(5, 'Bucky Irving'));
  assert.ok(has(4, 'Bucky Irving'));
  assert.ok(!has(4, 'Garrett Wilson'));
  assert.ok(
    !teams
      .find((t) => t.id === 3)
      .adjustedLineup.some((p) => p.position === 'TE'),
  );
  assert.ok(
    !teams
      .find((t) => t.id === 2)
      .adjustedLineup.some((p) => p.position === 'DEF'),
  );
  const trades = evidence.transactions.filter((t) => t.type === 'trade');
  assert.equal(trades.length, 1);
  assert.deepEqual(
    trades[0].adds.map((p) => [p.name, p.rosterId]),
    [
      ['Garrett Wilson', 5],
      ['Bucky Irving', 4],
      ['Jonah Coleman', 5],
    ],
  );
  assert.deepEqual(trades[0].draftPicks, []);
  assert.deepEqual(trades[0].waiverBudget, []);
});
