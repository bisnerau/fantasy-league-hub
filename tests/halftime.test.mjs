import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { draftRecapContent } from '../lib/data/draft-recap-content.ts';
import { buildHalftimeLedger } from '../lib/season/halftime-ledger.ts';
import { halftimeForecastInsights } from '../lib/season/halftime-forecasts.ts';
import {
  featureHalftime,
  halftimeHonours,
  halftimePublication,
} from '../lib/data/halftime/publication.ts';

const snapshot = JSON.parse(
  readFileSync(new URL('../lib/data/halftime/snapshot.json', import.meta.url)),
);
const evidence = JSON.parse(
  readFileSync(
    new URL('../docs/research/2026-halftime-ledger.json', import.meta.url),
  ),
);
const ledger = buildHalftimeLedger(evidence);

void test('published honours match the frozen league and acquisition evidence', () => {
  const team = snapshot.teams.find((t) => t.id === halftimeHonours[0].rosterId);
  assert.equal(team.rank, 1);
  assert.equal(team.record, halftimeHonours[0].metric);
  assert.equal(team.points, 973.88);
  assert.deepEqual(team.allPlay, [59, 18, 0]);
  const bestPickup = [...ledger.pickups]
    .filter((p) => p.points !== null)
    .sort((a, b) => b.points - a.points)[0];
  assert.equal(bestPickup.player, halftimeHonours[1].winner);
  assert.equal(bestPickup.rosterId, halftimeHonours[1].rosterId);
  const biggestMiss = [...snapshot.teams].sort(
    (a, b) => Math.abs(b.ai - b.rank) - Math.abs(a.ai - a.rank),
  )[0];
  assert.equal(biggestMiss.id, halftimeHonours[2].rosterId);
  assert.equal(
    String(Math.abs(biggestMiss.ai - biggestMiss.rank)),
    halftimeHonours[2].metric,
  );
  assert.equal(
    featureHalftime(snapshot.leagueId, '2026', 8),
    halftimePublication.isPublic,
  );
  for (const [league, season, week] of [
    [snapshot.leagueId, '2026', 7],
    [snapshot.leagueId, '2026', 15],
    [snapshot.leagueId, '2027', 8],
    ['other', '2026', 8],
  ]) {
    assert.equal(featureHalftime(league, season, week), false);
  }
});

void test('transaction attribution reconciles every frozen score and preserves unresolved returns', () => {
  for (const team of ledger.teams) {
    assert.equal(
      team.total,
      snapshot.teams.find((t) => t.id === team.rosterId).points,
    );
    assert.equal(
      Math.round(
        Object.values(team.categories).reduce((a, b) => a + b, 0) * 100,
      ),
      Math.round(team.total * 100),
    );
  }
  assert.equal(ledger.teams.find((t) => t.rosterId === 3).pickupPoints, null);
  assert.equal(ledger.teams.find((t) => t.rosterId === 3).incompleteReturns, 1);
  const goff = ledger.pickups.find(
    (p) => p.player === 'Jared Goff' && p.rosterId === 3,
  );
  assert.equal(goff.points, 86.8);
  assert.equal(goff.cost, 5);
  assert.equal(goff.starts, 4);
  assert(ledger.trades.every((t) => t.firstWeek === 8 && t.weeks.length === 0));
});

void test('duplicates and post-halftime moves cannot change first-half returns or spending', () => {
  const changed = structuredClone(evidence);
  changed.transactions.push(...changed.transactions);
  changed.transactions.push({
    ...changed.transactions.find((t) => t.type === 'waiver'),
    transaction_id: 'after-cutoff',
    status_updated: Date.parse(evidence.cutoff) + 1,
    settings: { waiver_bid: 1000 },
  });
  assert.deepEqual(buildHalftimeLedger(changed), ledger);
});

void test('missing scoring weeks fail the activity build instead of becoming zero returns', () => {
  assert.throws(
    () =>
      buildHalftimeLedger({ ...evidence, weeks: evidence.weeks.slice(0, 6) }),
    /Seven complete/,
  );
});

void test('manager receipt insights count only complete unique ballots and preserve ties', () => {
  const teams = [
    { id: 1, name: 'One', rank: 1, ai: 2 },
    { id: 2, name: 'Two', rank: 2, ai: 1 },
    { id: 3, name: 'Three', rank: 3, ai: 3 },
  ];
  const profiles = [
    { id: 'a', display_name: 'Alice', roster_id: 3 },
    { id: 'b', display_name: 'Bob', roster_id: 1 },
    { id: 'c', display_name: 'Non-submitter', roster_id: 2 },
  ];
  const ballots = [
    { voter_id: 'a', rankings: [3, 2, 1] },
    { voter_id: 'b', rankings: [1, 2, 3] },
    { voter_id: 'a', rankings: [3, 2, 1] },
    { voter_id: 'c', rankings: [1, 1, 3] },
    { voter_id: 'd', rankings: [1, 2] },
  ];
  const r = halftimeForecastInsights(ballots, profiles, teams);
  assert.equal(r.count, 2);
  assert.equal(r.scores.length, 3);
  assert(!r.scores.some((s) => s.name === 'Non-submitter'));
  assert.equal(r.optimism[0].name, 'Alice');
  assert.equal(r.optimism[0].gap, 2);
  assert.equal(r.splits.length, 2);
  assert.equal(r.scores[0].name, 'Bob');
  const tied = halftimeForecastInsights(
    [
      { voter_id: 'a', rankings: [1, 2, 3] },
      { voter_id: 'b', rankings: [1, 2, 3] },
    ],
    profiles,
    teams,
  );
  assert.deepEqual(
    tied.scores.slice(0, 2).map((s) => s.position),
    [1, 1],
  );
  assert.equal(halftimeForecastInsights([], profiles, teams), null);
});

void test('halftime preserves all twelve original predictions and quotes verbatim', () => {
  assert.equal(snapshot.throughWeek, 7);
  assert.equal(snapshot.teams.length, 12);
  assert.equal(new Set(snapshot.teams.map((t) => t.id)).size, 12);
  for (const team of snapshot.teams) {
    const original = draftRecapContent.entries.find(
      (t) => t.rosterId === team.id,
    );
    assert.equal(team.ai, original.predictedFinish);
    assert.equal(team.quote, original.seasonOutlook);
    assert.equal(team.draftGrade, original.grade);
  }
});

void test('frozen totals and all-play are reproducible from exactly seven weeks', () => {
  for (const team of snapshot.teams) {
    assert.equal(team.scores.length, 7);
    assert.equal(
      Math.round(team.scores.reduce((a, b) => a + b, 0) * 100),
      Math.round(team.points * 100),
    );
    const comparison = [0, 0, 0];
    team.scores.forEach((score, week) => {
      snapshot.teams
        .filter((other) => other.id !== team.id)
        .forEach((other) => {
          comparison[
            score > other.scores[week] ? 0 : score < other.scores[week] ? 1 : 2
          ]++;
        });
    });
    assert.deepEqual(team.allPlay, comparison, team.name);
    assert.equal(
      team.allPlay.reduce((a, b) => a + b, 0),
      77,
    );
  }
});

void test('halfway order uses the frozen seven-game records and points', () => {
  const sorted = [...snapshot.teams].sort(
    (a, b) => b.wins - a.wins || b.points - a.points,
  );
  sorted.forEach((team, i) => {
    assert.equal(team.rank, i + 1);
    assert.equal(
      team.record
        .split('–')
        .map(Number)
        .reduce((a, b) => a + b, 0),
      7,
    );
  });
  assert.equal(
    snapshot.teams.reduce((sum, t) => sum + Math.abs(t.ai - t.rank), 0),
    40,
  );
});
