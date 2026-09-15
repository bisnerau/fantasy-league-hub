import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  previewPublishTimeForLock,
  canPublishPreview,
  createMatchupPreview,
  createMatchupReview,
  bestBenchSwap,
  readPreview,
} from '../lib/predictions/stories.ts';
import { sundayKickoffForWeek } from '../lib/predictions/rules.ts';

const player = (
  id,
  position,
  projectedPoints,
  actualPoints,
  slot = position,
) => ({
  id,
  name: `Player ${id}`,
  position,
  eligiblePositions: [position],
  slot,
  projectedPoints,
  actualPoints,
  starter: slot !== 'BN',
  nflTeam: 'BUF',
});
const team = (rosterId, ownerName, projectedScore, actualScore) => ({
  rosterId,
  ownerName,
  teamName: `${ownerName} XI`,
  projectedScore,
  actualScore,
  starters: [
    player(`${rosterId}-qb`, 'QB', 20, 20),
    player(`${rosterId}-wr`, 'WR', 15, 10),
  ],
  bench: [],
  wins: 9,
  losses: 0,
  ties: 0,
  avatar: null,
});
const matchup = () => ({
  sleeperMatchupId: 1,
  databaseId: 1,
  home: team(6, 'Alan Horgan', 120, 110),
  away: team(8, 'Hugo Walsh', 115, 112),
});
const context = {
  leagueId: '1389706813993160704',
  season: '2026',
  week: 2,
  history: [
    {
      week: 1,
      rows: [
        { roster_id: 6, matchup_id: 1, points: 100 },
        { roster_id: 8, matchup_id: 1, points: 110 },
      ],
    },
  ],
};
const text = (story) => JSON.stringify(story);

void test('Thursday 11am editions follow the Irish clock in summer and winter', () => {
  for (const [week, expected] of [
    [2, '2026-09-17T10:00:00.000Z'],
    [8, '2026-10-29T11:00:00.000Z'],
  ]) {
    const lock = sundayKickoffForWeek(2026, week).toISOString();
    assert.equal(previewPublishTimeForLock(lock).toISOString(), expected);
    const time = Date.parse(expected);
    const dates = [expected.slice(0, 10)];
    assert.equal(canPublishPreview(lock, dates, time - 1), false);
    assert.equal(canPublishPreview(lock, dates, time), true);
    assert.equal(canPublishPreview(lock, dates, time + 3600000), true);
    assert.equal(canPublishPreview(lock, dates, time + 7200000), false);
  }
});
void test('no backdated preview when a Wednesday game already occurred or dates are missing', () => {
  const lock = sundayKickoffForWeek(2026, 2).toISOString();
  const now = Date.parse('2026-09-17T10:00:00Z');
  assert.equal(canPublishPreview(lock, ['2026-09-16'], now), false);
  assert.equal(canPublishPreview(lock, [], now), false);
  assert.equal(canPublishPreview('invalid', ['2026-09-17'], now), false);
});
void test('preview uses prior-week form, complete estimates and the household rivalry', () => {
  const story = createMatchupPreview(matchup(), context);
  assert.equal(story.pickRosterId, 6);
  assert.match(story.headline, /home/);
  assert.match(text(story), /Alan arrives 0–1/);
  assert.match(text(story), /Hugo arrives 1–0/);
  assert.doesNotMatch(text(story), /9–0/);
  assert.match(text(story), /live together/);
});
void test('preview does not read this game’s actual scores or future-week results', () => {
  const m = matchup(),
    time = Date.parse('2026-09-17T10:00:00Z');
  const original = createMatchupPreview(m, context, time);
  m.home.actualScore = 999;
  m.away.starters[0].actualPoints = 999;
  assert.deepEqual(
    createMatchupPreview(
      m,
      { ...context, history: [...context.history, { week: 3, rows: [] }] },
      time,
    ),
    original,
  );
});
void test('missing and zero-filled projections never become a winner forecast', () => {
  const m = matchup();
  m.home.projectedScore = null;
  assert.equal(createMatchupPreview(m, context), null);
  m.home.projectedScore = 0;
  assert.equal(createMatchupPreview(m, context), null);
});
void test('review owns an incorrect call and does not invent one for historical games', () => {
  const m = matchup();
  assert.match(
    text(createMatchupReview(m, context, [110, 112])),
    /No preview was saved/,
  );
  m.preview = createMatchupPreview(m, context);
  const original = structuredClone(m.preview);
  const review = createMatchupReview(m, context, [110, 112]);
  assert.match(text(review), /We picked Alan Horgan/);
  assert.match(text(review), /That is a miss/);
  assert.deepEqual(m.preview, original);
  m.home.actualScore = 120;
  assert.match(
    text(createMatchupReview(m, context, [120, 112])),
    /call landed/,
  );
});
void test('ties do not claim a correct winner or a losing team', () => {
  const m = matchup();
  m.preview = createMatchupPreview(m, context);
  m.home.actualScore = 112;
  const review = createMatchupReview(m, context, [112, 112]);
  assert.match(review.summary, /finish level/);
  assert.match(text(review), /winner call did not land/);
  assert.doesNotMatch(review.summary, /beats/);
});
void test('bench analysis requires a legal single swap and does not add incompatible alternatives', () => {
  const t = team(6, 'Alan', 120, 110);
  t.bench = [
    player('te', 'TE', 10, 99, 'BN'),
    player('wr-a', 'WR', 10, 20, 'BN'),
    player('wr-b', 'WR', 10, 19, 'BN'),
  ];
  assert.equal(bestBenchSwap(t).bench.id, 'wr-a');
  assert.equal(bestBenchSwap(t).gain, 10);
  t.starters[1].slot = 'WRRB_FLEX';
  assert.equal(bestBenchSwap(t).bench.id, 'wr-a');
  t.starters[1].slot = 'FLEX';
  assert.equal(bestBenchSwap(t).bench.id, 'te');
});
void test('missing points are not zero; a genuine zero remains a usable score', () => {
  const m = matchup();
  m.home.bench = [player('bench', 'WR', 10, 20, 'BN')];
  m.home.starters[1].actualPoints = null;
  assert.equal(bestBenchSwap(m.home), null);
  assert.match(
    text(createMatchupReview(m, context, [110, 112])),
    /complete named starter breakdown is unavailable/,
  );
  m.home.starters[1].actualPoints = 0;
  assert.equal(bestBenchSwap(m.home).gain, 20);
});
void test('review explains a high-scoring loss with correct all-play counts', () => {
  const m = matchup();
  const review = createMatchupReview(
    m,
    context,
    [110, 112, 100, 99, 98, 97, 96, 95, 94, 93, 92, 91],
  );
  assert.match(review.summary, /outscored 10 of the other 11/);
});
void test('incomplete stored preview is rejected', () => {
  assert.equal(readPreview({ version: 1, summary: 'partial' }), null);
  const preview = createMatchupPreview(matchup(), context);
  assert.deepEqual(readPreview(preview), preview);
});
void test('a bench swap that exactly closes a decimal margin is a tie, not a win', () => {
  const m = matchup();
  m.home.actualScore = 100.1;
  m.away.actualScore = 110.2;
  m.home.starters[1].actualPoints = 10.1;
  m.home.bench = [player('bench', 'WR', 10, 20.2, 'BN')];
  const review = createMatchupReview(m, context, [100.1, 110.2]);
  assert.match(text(review), /enough to tie this result/);
  assert.doesNotMatch(text(review), /enough to reverse this result/);
});
