import assert from 'node:assert/strict';
import { test } from 'node:test';
import { scheduleSnapshot } from '../lib/data/schedule-snapshot.ts';
import {
  getSchedulePreview,
  headToHead,
  scheduleStories,
} from '../lib/data/schedule-preview.ts';
import { draftRecapContent } from '../lib/data/draft-recap-content.ts';
import { draftByeByPick } from '../lib/data/draft-byes.ts';

void test('confirmed schedule has six unique pairings every week and all twelve manager previews', () => {
  for (let week = 1; week <= 14; week++) {
    const games = scheduleSnapshot.fixtures.filter((g) => g.week === week);
    assert.equal(games.length, 6);
    assert.deepEqual(
      games.flatMap((g) => [g.home, g.away]).sort((a, b) => a - b),
      Array.from({ length: 12 }, (_, i) => i + 1),
    );
  }
  for (const entry of draftRecapContent.entries) {
    const p = getSchedulePreview(entry.rosterId);
    assert.equal(p.fixtures.length, 14);
    assert.ok(
      p.fixtures.some(
        (g) =>
          g.opponent.rosterId === scheduleStories[entry.rosterId].opponentId,
      ),
    );
    assert.ok(p.byeWatch.byes.some((pick) => pick.round <= 7));
    assert.ok(
      entry.picks.every((pick) =>
        Number.isInteger(draftByeByPick[pick.overall]),
      ),
    );
    for (let i = 0; i < 12; i++) {
      const average =
        p.fixtures
          .slice(i, i + 3)
          .reduce((sum, g) => sum + g.opponent.predictedFinish, 0) / 3;
      assert.ok(p.toughest.average <= average);
    }
  }
  assert.equal(getSchedulePreview(99), null);
});

void test('named rivalries occur in their confirmed weeks', () => {
  assert.deepEqual(
    getSchedulePreview(5)
      .fixtures.filter((g) => g.opponent.rosterId === 6)
      .map((g) => g.week),
    [8],
  );
  assert.deepEqual(
    getSchedulePreview(9)
      .fixtures.filter((g) => g.opponent.rosterId === 10)
      .map((g) => g.week),
    [11],
  );
});

void test('historical head-to-head is reciprocal and counts only the archived regular season', () => {
  assert.equal(scheduleSnapshot.history.length, 84);
  for (let a = 1; a <= 12; a++) {
    let total = 0;
    for (let b = 1; b <= 12; b++) {
      if (a === b) continue;
      const first = headToHead(a, b),
        second = headToHead(b, a);
      assert.equal(first.wins, second.losses);
      assert.equal(first.losses, second.wins);
      assert.equal(first.ties, second.ties);
      assert.equal(first.games, first.wins + first.losses + first.ties);
      total += first.games;
    }
    assert.equal(total, 14);
  }
});
