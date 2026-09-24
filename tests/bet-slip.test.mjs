import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getLine, getLineResult } from '../lib/predictions/line.ts';
import { getSlip } from '../lib/predictions/slip.ts';

const team = (rosterId, ownerName, projectedScore, actualScore = null) => ({
  rosterId,
  ownerName,
  teamName: `${ownerName} FC`,
  avatar: null,
  wins: 0,
  losses: 0,
  ties: 0,
  projectedScore,
  actualScore,
  starters: [],
  bench: [],
});
const matchup = (id, home, away) => ({
  databaseId: id,
  sleeperMatchupId: id,
  home,
  away,
});

void test('the line rounds the projected margin to a half point', () => {
  const line = getLine(
    matchup(1, team(1, 'Shane', 118.4), team(2, 'David', 112)),
  );
  assert.equal(line.favourite, 'home');
  assert.equal(line.rosterId, 1);
  assert.equal(line.spread, 6.5);
  assert.equal(line.label, 'Shane −6.5');
  assert.equal(
    getLine(matchup(1, team(1, 'Shane', 100), team(2, 'David', 107.1))).label,
    'David −7',
  );
});

void test('close projections are a pick’em and missing projections have no line', () => {
  assert.equal(
    getLine(matchup(1, team(1, 'A', 100.1), team(2, 'B', 100))).label,
    'Pick’em',
  );
  assert.equal(
    getLine(matchup(1, team(1, 'A', null), team(2, 'B', 100))),
    null,
  );
});

void test('line results need both scores and judge the favourite’s margin', () => {
  const result = (home, away) => {
    const game = matchup(1, team(1, 'A', 110, home), team(2, 'B', 100, away));
    return getLineResult(game, getLine(game));
  };
  assert.equal(result(125, 110), 'covered');
  assert.equal(result(105, 100), 'short');
  assert.equal(result(110, 100), 'push');
  assert.equal(result(99, 100), 'upset');
  assert.equal(result(110, null), null);
  const pickem = matchup(1, team(1, 'A', 100, 120), team(2, 'B', 100, 90));
  assert.equal(getLineResult(pickem, getLine(pickem)), null);
});

void test('the slip counts saved picks, the Banker and the maximum return', () => {
  const games = [
    matchup(1, team(1, 'A', 1), team(2, 'B', 1)),
    matchup(2, team(3, 'C', 1), team(4, 'D', 1)),
    matchup(3, team(5, 'E', 1), team(6, 'F', 1)),
  ];
  const votes = [
    { matchup_id: 1, voter_id: 'me', selected_roster_id: 2 },
    { matchup_id: 3, voter_id: 'me', selected_roster_id: 5 },
    { matchup_id: 2, voter_id: 'other', selected_roster_id: 3 },
  ];
  const bankers = [{ prediction_week_id: 1, matchup_id: 3, voter_id: 'me' }];
  const slip = getSlip(games, votes, bankers, 'me');
  assert.equal(slip.selections.length, 2);
  assert.equal(slip.total, 3);
  assert.equal(slip.banker.team.ownerName, 'E');
  assert.equal(slip.maxReturn, 3);
  assert.equal(slip.nextOpen, 2);
  assert.equal(getSlip(games, votes, [], undefined).selections.length, 0);
});

void test('docket verdicts need both final scores and ties are void', () => {
  const games = [
    matchup(1, team(1, 'A', 1, 120), team(2, 'B', 1, 100)),
    matchup(2, team(3, 'C', 1, 90), team(4, 'D', 1, 95)),
    matchup(3, team(5, 'E', 1, 100), team(6, 'F', 1, 100)),
    matchup(4, team(7, 'G', 1, 100), team(8, 'H', 1, null)),
  ];
  const votes = games.map((game) => ({
    matchup_id: game.databaseId,
    voter_id: 'me',
    selected_roster_id: game.home.rosterId,
  }));
  assert.deepEqual(
    getSlip(games, votes, [], 'me').selections.map((s) => s.verdict),
    ['won', 'lost', 'void', null],
  );
});
