import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  weekFourReports,
  weekFourPublishedAt,
} from '../lib/data/newsletters/2026-week-4.ts';
import { getMatchupNewsletter } from '../lib/data/matchup-newsletters.ts';
import { getMatchOfTheWeek } from '../lib/data/match-of-the-week.ts';
import {
  getClubhouseEditorial,
  getLeadBesideTicket,
} from '../lib/data/clubhouse-editorial.ts';
import { getPreviewTalkingPoints } from '../lib/data/preview-talking-points.ts';

const snapshot = JSON.parse(
  readFileSync(
    new URL('../docs/research/2026-week-4-sleeper.json', import.meta.url),
    'utf8',
  ),
);
const now = Date.parse(weekFourPublishedAt);
const data = {
  leagueId: snapshot.leagueId,
  season: snapshot.season,
  week: 4,
  finalized: false,
  matchups: weekFourReports.map((e) => ({
    sleeperMatchupId: e.sleeperMatchupId,
    home: { rosterId: e.homeRosterId },
    away: { rosterId: e.awayRosterId },
    preview: e.preview,
  })),
};

void test('all six Friday outlooks preserve verified fixtures and projections and disclose late calls', () => {
  assert.equal(weekFourReports.length, 6);
  assert.equal(new Set(weekFourReports.map((e) => e.sleeperMatchupId)).size, 6);
  assert.ok(now >= Date.parse(snapshot.retrievedAt));
  assert.ok(now > Date.parse(snapshot.firstKickoff));
  for (const e of weekFourReports) {
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
  assert.match(home.talkingPoints[0].title, /\$31/);
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
    { week: 5 },
    { finalized: true },
  ]) {
    assert.equal(getPreviewTalkingPoints({ ...data, ...change }, now), null);
  }
});
