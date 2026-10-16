import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  weekSixReports,
  weekSixPublishedAt,
} from '../lib/data/newsletters/2026-week-6.ts';
import { getMatchupNewsletter } from '../lib/data/matchup-newsletters.ts';
import { getMatchOfTheWeek } from '../lib/data/match-of-the-week.ts';
import {
  getClubhouseEditorial,
  getLeadBesideTicket,
} from '../lib/data/clubhouse-editorial.ts';
import { getPreviewTalkingPoints } from '../lib/data/preview-talking-points.ts';

const snapshot = JSON.parse(
  readFileSync(
    new URL('../docs/research/2026-week-6-sleeper.json', import.meta.url),
    'utf8',
  ),
);
const now = Date.parse(weekSixPublishedAt);
const data = {
  leagueId: snapshot.leagueId,
  season: snapshot.season,
  week: 6,
  finalized: false,
  matchups: weekSixReports.map((e) => ({
    sleeperMatchupId: e.sleeperMatchupId,
    home: { rosterId: e.homeRosterId },
    away: { rosterId: e.awayRosterId },
    preview: e.preview,
  })),
};

void test('all six Friday outlooks preserve verified fixtures and projections and disclose late calls', () => {
  assert.equal(weekSixReports.length, 6);
  assert.equal(new Set(weekSixReports.map((e) => e.sleeperMatchupId)).size, 6);
  assert.ok(now >= Date.parse(snapshot.retrievedAt));
  assert.ok(now > Date.parse(snapshot.firstKickoff));
  for (const e of weekSixReports) {
    const teams = snapshot.teams.filter(
      (t) => t.matchupId === e.sleeperMatchupId,
    );
    assert.deepEqual(
      teams.map((t) => t.rosterId),
      [e.homeRosterId, e.awayRosterId],
    );
    assert.equal(e.preview.homeProjection, teams[0].pprTotal);
    assert.equal(e.preview.awayProjection, teams[1].pprTotal);
    assert.match(e.preview.summary, /Friday/);
    assert.match(e.preview.sections.at(-1).title, /Friday call/);
    assert.ok(teams.some((t) => t.rosterId === e.preview.pickRosterId));
    assert.deepEqual(getMatchupNewsletter(e, undefined, now), {
      preview: e.preview,
      review: null,
    });
    assert.equal(getMatchupNewsletter(e, undefined, now - 1).preview, null);
  }
});

void test('Friday feature and talking points update the homepage without replacing the ranking archive', () => {
  const feature = getMatchOfTheWeek(data, undefined, now);
  assert.equal(feature.sleeperMatchupId, 5);
  assert.match(feature.reason, /Friday selection, after Thursday/);
  assert.equal(getMatchOfTheWeek(data, undefined, now - 1), null);
  const home = getClubhouseEditorial(data, null, now);
  assert.equal(home.lead.matchup.sleeperMatchupId, 5);
  assert.equal(getLeadBesideTicket(home).matchup.sleeperMatchupId, 1);
  assert.equal(home.talkingPoints.length, 3);
  assert.match(home.talkingPoints[0].title, /Evens/);
  assert.notDeepEqual(home.talkingPoints, home.ranking.talkingPoints);
  const before = getClubhouseEditorial(
    { ...data, matchups: [] },
    null,
    now - 1,
  );
  assert.deepEqual(before.talkingPoints, before.ranking.talkingPoints);
  for (const change of [
    { leagueId: 'other' },
    { season: '2027' },
    { week: 7 },
    { finalized: true },
  ]) {
    assert.equal(getPreviewTalkingPoints({ ...data, ...change }, now), null);
  }
});

void test('pricing uses all six verified pairs, legal available players and Thursday actual scores', () => {
  const odds = JSON.parse(
    readFileSync(
      new URL('../lib/data/experiments/odds-week-six.json', import.meta.url),
      'utf8',
    ),
  );
  assert.equal(odds.week, 6);
  assert.equal(odds.lineupBasis, 'best');
  assert.equal(odds.matchups.length, 6);
  for (const match of odds.matchups) {
    assert.deepEqual(
      match.teams.map((t) => t.id),
      snapshot.teams
        .filter((t) => t.matchupId === match.id)
        .map((t) => t.rosterId),
    );
    for (const team of match.teams) {
      const evidence = snapshot.teams.find((t) => t.rosterId === team.id);
      for (const player of team.adjustedLineup) {
        const source = [...evidence.starters, ...evidence.bench].find(
          (p) =>
            p.name === player.name ||
            (p.position === 'DEF' && p.id === evidence.starters.at(-1).id),
        );
        assert.ok(source, player.name);
        if (player.locked) {
          assert.ok(evidence.starters.includes(source));
          assert.equal(player.points, source.points);
        } else {
          assert.ok(
            !['Out', 'IR', 'PUP', 'Sus'].includes(source.status),
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
    }
  }
  const keenan = odds.matchups[2].teams[0];
  assert.ok(keenan.missing.includes('Jared Goff'));
  assert.equal(
    keenan.adjustedLineup.some((p) => p.position === 'QB'),
    false,
  );
  assert.equal(
    odds.matchups[3].teams[0].adjustedLineup.some(
      (p) => p.name === 'A.J. Brown',
    ),
    false,
  );
});
