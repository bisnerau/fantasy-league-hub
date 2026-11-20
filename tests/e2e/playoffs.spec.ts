import { test, expect } from '@playwright/test';
import { simulate } from '../../lib/playoffs/model';
import type { ForecastInput } from '../../lib/playoffs/types';
const input: ForecastInput = {
  version: 'test',
  leagueId: 'fixture-league',
  season: 2026,
  asOf: '2026-11-20T10:00:00Z',
  sourceCutoff: '2026-11-20T10:00:00Z',
  completedThrough: 0,
  regularSeasonWeeks: 1,
  playoffTeams: 6,
  slots: ['QB'],
  returns: [],
  calibration: {
    version: 'fixture',
    samples: 500,
    throughWeek: 0,
    positionVariance: { QB: 25 },
    teamVarianceScale: 1,
    summary: 'Fixture calibration',
  },
  teams: Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Fixture team ${i + 1}`,
    manager: `Manager ${i + 1}`,
    wins: 0,
    losses: 0,
    ties: 0,
    pointsFor: 0,
    pointsAgainst: 0,
    rank: i + 1,
  })),
  fixtures: Array.from({ length: 6 }, (_, i) => ({
    key: `1:${i + 1}`,
    week: 1,
    matchupId: i + 1,
    home: i * 2 + 1,
    away: i * 2 + 2,
  })),
  lineups: Array.from({ length: 12 }, (_, i) => ({
    rosterId: i + 1,
    week: 1,
    locked: [],
    notes: ['Questionable player remains eligible.'],
    players: [
      {
        id: `${i + 1}`,
        name: `Player ${i + 1}`,
        position: 'QB',
        team: 'X',
        mean: 10,
        variance: 25,
        available: true,
        gameId: `${i + 1}`,
        kickoff: '2026-12-01T18:00:00Z',
        state: 'pre',
        actual: null,
      },
    ],
  })),
};
const result = simulate(input);
test.beforeEach(async ({ context }) => {
  await context.route('**/*', (route) =>
    ['localhost', '127.0.0.1'].includes(new URL(route.request().url()).hostname)
      ? route.continue()
      : route.abort(),
  );
});
for (const width of [320, 390, 1440])
  test(`forecast scenarios, keyboard and reset work at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.route('**/api/playoff-chances', (route) =>
      route.fulfill({
        json: {
          snapshot: { id: 'fixture', input, result },
          previous: null,
          stale: true,
          notice: 'Showing the last valid forecast.',
        },
      }),
    );
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/playoff-chances');
    await expect(page.locator('.pc-team')).toHaveCount(12);
    await expect(
      page.getByText('Showing the last valid forecast.', { exact: false }),
    ).toBeVisible();
    await expect(
      page.getByText('Calculating your scenario…', { exact: false }),
    ).toHaveCount(0);
    const first = page.locator('.pc-team').first();
    await first.locator('summary').first().focus();
    await page.keyboard.press('Enter');
    await expect(first.locator('.pc-team-detail')).toBeVisible();
    await page
      .getByLabel('Week 1: Manager 1 vs Manager 2', { exact: true })
      .selectOption('1');
    await expect(
      page.getByText('IN THIS SCENARIO', { exact: true }),
    ).toBeVisible();
    await expect(first.locator('.pc-playoff b')).toHaveText('>99%');
    await expect(first.locator('.pc-fixture')).toContainText('>99%');
    await page.getByRole('button', { name: 'Reset everything' }).click();
    await expect(
      page.getByText('PUBLISHED FORECAST', { exact: true }),
    ).toBeVisible();
    await expect(first.locator('.pc-playoff b')).toHaveText(/(49|50|51)%/);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.locator('.pc-method>summary').click();
    await expect(
      page.getByRole('link', { name: 'The Halftime Show archive' }),
    ).toHaveAttribute('href', '/halftime');
    if (width === 390)
      await page.screenshot({
        path: '/private/tmp/playoff-mobile.png',
        fullPage: true,
      });
    expect(errors).toEqual([]);
  });
test('no valid snapshot shows unavailable and no made-up probabilities', async ({
  page,
}) => {
  await page.route('**/api/playoff-chances', (route) =>
    route.fulfill({
      json: {
        snapshot: null,
        previous: null,
        stale: true,
        notice: 'Forecast unavailable.',
      },
    }),
  );
  await page.goto('/playoff-chances');
  await expect(page.getByText('Forecast unavailable.')).toBeVisible();
  await expect(page.locator('.pc-team')).toHaveCount(0);
});
