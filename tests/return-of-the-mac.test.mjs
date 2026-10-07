import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import {
  formatAudioTime,
  getMacEpisode,
  getMacEpisodes,
  macEpisodes,
} from '../lib/data/return-of-the-mac.ts';

void test('only published episodes are listed, newest first, without rewriting the archive', () => {
  const pilot = macEpisodes[0];
  const later = {
    ...pilot,
    slug: 'later',
    publishedAt: '2026-10-05T12:00:00Z',
  };
  const unpublished = { ...pilot, slug: 'draft', publishedAt: '' };
  const records = Object.freeze([
    Object.freeze(pilot),
    Object.freeze(later),
    Object.freeze(unpublished),
  ]);
  assert.deepEqual(
    getMacEpisodes(Date.parse('2026-10-02T20:00:00Z'), records),
    [],
  );
  assert.deepEqual(getMacEpisodes(Date.parse(pilot.publishedAt), records), [
    pilot,
  ]);
  assert.deepEqual(getMacEpisodes(Date.parse(later.publishedAt), records), [
    later,
    pilot,
  ]);
  assert.equal(records[0], pilot);
  assert.equal(
    getMacEpisode('later', Date.parse(pilot.publishedAt), records),
    undefined,
  );
  assert.equal(
    getMacEpisode(pilot.slug, Date.parse(later.publishedAt), records),
    pilot,
  );
  assert.equal(getMacEpisode('missing'), undefined);
});

void test('pilot retains its context and references available permanent assets', () => {
  const pilot = macEpisodes[0];
  assert.equal(pilot.context, 'Week 4 preview/pilot');
  assert.equal(pilot.recordedOn, '2026-10-02');
  assert.equal(pilot.manager, 'Joe Ennis');
  assert.equal(pilot.transcript, undefined);
  assert.ok(existsSync(`public${pilot.audio}`));
  assert.ok(existsSync(`public${pilot.portrait}`));
  assert.equal(
    new Set(macEpisodes.map((episode) => episode.slug)).size,
    macEpisodes.length,
  );
});

void test('audio timestamps handle metadata fractions and unavailable values', () => {
  assert.equal(formatAudioTime(126.275875), '2:06');
  assert.equal(formatAudioTime(0), '0:00');
  assert.equal(formatAudioTime(61), '1:01');
  assert.equal(formatAudioTime(Number.NaN), '0:00');
  assert.equal(formatAudioTime(-1), '0:00');
});
