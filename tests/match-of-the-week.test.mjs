import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import {
  getMatchOfTheWeek,
  matchOfTheWeekSelections,
  orderMatchupsForDisplay,
} from '../lib/data/match-of-the-week.ts';

const snapshot = JSON.parse(
  readFileSync(
    new URL('../docs/research/2026-week-2-sleeper.json', import.meta.url),
    'utf8',
  ),
);
const matchups = Array.from({ length: 6 }, (_, index) => {
  const teams = snapshot.teams.filter((t) => t.matchupId === index + 1);
  return {
    databaseId: 100 + index,
    sleeperMatchupId: index + 1,
    home: { rosterId: teams[0].rosterId },
    away: { rosterId: teams[1].rosterId },
  };
});
const data = {
  leagueId: snapshot.leagueId,
  season: snapshot.season,
  week: 2,
  matchups,
};
const selectedAt = Date.parse(matchOfTheWeekSelections[0].selectedAt);

void test('the household derby is selected before kickoff and stays selected in the archive', () => {
  const selection = getMatchOfTheWeek(data, undefined, selectedAt);
  assert.equal(selection.sleeperMatchupId, 4);
  assert.equal(selection.homeRosterId, 6);
  assert.equal(selection.awayRosterId, 8);
  assert.ok(selectedAt < Date.parse(snapshot.firstKickoff));
  assert.deepEqual(
    getMatchOfTheWeek(
      { ...data, finalized: true },
      undefined,
      Date.parse('2026-09-23T12:00:00Z'),
    ),
    selection,
  );
  assert.equal(getMatchOfTheWeek(data, undefined, selectedAt - 1), null);
});

void test('selection requires the exact league, season, week and both fixture participants', () => {
  for (const change of [
    { leagueId: 'other-league' },
    { season: '2027' },
    { week: 1 },
    { matchups: matchups.filter((m) => m.sleeperMatchupId !== 4) },
    { matchups: matchups.map((m) => ({ ...m, home: m.away, away: m.home })) },
    {
      matchups: matchups.map((m) => ({
        ...m,
        sleeperMatchupId: m.sleeperMatchupId + 10,
      })),
    },
  ]) {
    assert.equal(
      getMatchOfTheWeek({ ...data, ...change }, undefined, selectedAt),
      null,
    );
  }
  assert.equal(
    getMatchOfTheWeek(
      data,
      [...matchOfTheWeekSelections, ...matchOfTheWeekSelections],
      selectedAt,
    ),
    null,
  );
});

void test('display ordering preserves every voting ID, team and remaining fixture order without mutating source data', () => {
  const before = structuredClone(matchups);
  const selection = getMatchOfTheWeek(data, undefined, selectedAt);
  const ordered = orderMatchupsForDisplay(matchups, selection);
  assert.deepEqual(
    ordered.map((m) => m.sleeperMatchupId),
    [4, 1, 2, 3, 5, 6],
  );
  assert.deepEqual(matchups, before);
  for (const m of ordered) {
    assert.equal(
      m,
      matchups.find((original) => original.databaseId === m.databaseId),
    );
  }
  assert.deepEqual(orderMatchupsForDisplay(matchups, null), matchups);
  assert.deepEqual(
    orderMatchupsForDisplay(matchups, { ...selection, awayRosterId: 99 }),
    matchups,
  );
});
