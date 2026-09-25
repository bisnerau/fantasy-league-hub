import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { navigationOrder } from '../lib/config/navigation.ts';
import { transitionDirection } from '../lib/navigation/transition.ts';

void test('the yard line sweeps forward along the navigation order', () => {
  assert.equal(
    transitionDirection('/', '/standings', navigationOrder),
    'forward',
  );
  assert.equal(
    transitionDirection('/matchups', '/my-season', navigationOrder),
    'forward',
  );
});

void test('returning towards Home sweeps back, so Back reverses the wipe', () => {
  assert.equal(transitionDirection('/standings', '/', navigationOrder), 'back');
  assert.equal(
    transitionDirection('/draft-recap', '/matchups', navigationOrder),
    'back',
  );
});

void test('nested pages count as their section', () => {
  assert.equal(
    transitionDirection('/wall-of-shame', '/managers/abc', navigationOrder),
    'back',
  );
  assert.equal(
    transitionDirection('/managers/abc', '/wall-of-shame', navigationOrder),
    'forward',
  );
  assert.equal(
    transitionDirection('/managers', '/managers/abc', navigationOrder),
    'forward',
  );
});

void test('Home only matches itself, not every path', () => {
  assert.equal(
    transitionDirection('/unknown-page', '/', navigationOrder),
    'forward',
  );
});

void test('unknown or missing origins sweep forward', () => {
  assert.equal(transitionDirection(null, '/', navigationOrder), 'forward');
  assert.equal(transitionDirection('', '/records', navigationOrder), 'forward');
  assert.equal(
    transitionDirection('/standings', '/somewhere-else', navigationOrder),
    'forward',
  );
  assert.equal(
    transitionDirection('/records', '/records', navigationOrder),
    'forward',
  );
});

void test('the direction helper survives being inlined into the head script', () => {
  // A fresh context has none of this module's scope, like the head script.
  const inlined = runInNewContext(`(${String(transitionDirection)})`);
  assert.equal(inlined('/standings', '/', navigationOrder), 'back');
  assert.equal(inlined('/', '/managers/x', navigationOrder), 'forward');
});
