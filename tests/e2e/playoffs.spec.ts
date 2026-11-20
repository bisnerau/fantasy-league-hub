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
    await expect(page.getByText('First forecast', { exact: true })).toHaveCount(
      0,
    );
    await expect(page.locator('.pc-finish-team')).toHaveCount(12);
    await expect(
      page.getByRole('region', { name: 'Finishing positions' }),
    ).toBeHidden();
    await page
      .getByRole('button', { name: 'All 12 places', exact: true })
      .click();
    await expect(
      page.getByRole('region', { name: 'The race for six' }),
    ).toBeHidden();
    const finishes = page.locator('.pc-finish-team').first();
    await finishes.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(finishes.locator('dt')).toHaveText([
      '1st',
      '2nd',
      '3rd',
      '4th',
      '5th',
      '6th',
      '7th',
      '8th',
      '9th',
      '10th',
      '11th',
      '12th',
    ]);
    const baselinePositions = await finishes.locator('dd').allTextContents();
    const stakes = page.getByRole('region', { name: 'Must win & can’t lose' });
    await expect(stakes.locator('article')).toHaveCount(12);
    await expect(stakes.locator('article').first()).toContainText('Can’t lose');
    await expect(stakes.locator('article').first()).toContainText(
      'A tie still leaves a route.',
    );
    const first = page.locator('.pc-team').first();
    await page
      .getByRole('button', { name: 'Playoffs & last', exact: true })
      .click();
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
    await expect(finishes.locator('dd').nth(11)).toHaveText('0%');
    await expect(first.locator('.pc-last b')).toHaveText('0%');
    expect(await finishes.locator('dd').allTextContents()).not.toEqual(
      baselinePositions,
    );
    await expect(stakes.locator('article')).toHaveCount(10);
    await expect(stakes.locator('article').first()).toContainText(
      'In this scenario',
    );
    await page.getByRole('button', { name: 'Reset everything' }).click();
    await expect(
      page.getByText('PUBLISHED FORECAST', { exact: true }),
    ).toBeVisible();
    await expect(first.locator('.pc-playoff b')).toHaveText(/(49|50|51)%/);
    await expect(finishes.locator('dd')).toHaveText(baselinePositions);
    await expect(stakes.locator('article')).toHaveCount(12);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    await page.locator('.pc-method>summary').click();
    await expect(
      page.getByRole('link', { name: 'The Halftime Show archive' }),
    ).toHaveAttribute('href', '/halftime');
    if (width === 390) {
      await page.locator('.pc-method>summary').click();
      await page
        .getByRole('heading', { name: 'The race for six', exact: true })
        .scrollIntoViewIfNeeded();
      await page.screenshot({
        path: '/private/tmp/playoff-mobile-ux.png',
        fullPage: false,
      });
    }
    expect(errors).toEqual([]);
  });
test('stakes group fixtures and future scenario weeks remain usable on mobile', async ({
  page,
}) => {
  const twoWeeks = structuredClone(input);
  twoWeeks.regularSeasonWeeks = 2;
  twoWeeks.playoffTeams = 2;
  twoWeeks.teams = twoWeeks.teams.slice(0, 4);
  twoWeeks.teams.forEach((team, i) => {
    team.wins = [0, 1, 0, 4][i];
  });
  const fixtures = twoWeeks.fixtures.slice(0, 2);
  const lineups = twoWeeks.lineups.slice(0, 4);
  twoWeeks.fixtures = [1, 2].flatMap((week) =>
    fixtures.map((f) => ({ ...f, week, key: `${week}:${f.matchupId}` })),
  );
  twoWeeks.lineups = [1, 2].flatMap((week) =>
    lineups.map((lineup) => ({ ...lineup, week })),
  );
  await page.route('**/api/playoff-chances', (route) =>
    route.fulfill({
      json: {
        snapshot: {
          id: 'two-weeks',
          input: twoWeeks,
          result: simulate(twoWeeks),
        },
        previous: null,
        stale: false,
        notice: null,
      },
    }),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/playoff-chances');
  const stakes = page.getByRole('region', { name: 'Must win & can’t lose' });
  const manager = stakes.locator('article').filter({
    has: page.getByRole('heading', { name: 'Manager 1', exact: true }),
  });
  await expect(manager.locator('li')).toHaveCount(2);
  await expect(manager.locator('.pc-stake')).toHaveCount(1);
  const weekTwo = page
    .locator('.pc-scenario-week')
    .filter({ has: page.locator('summary').filter({ hasText: 'Week 2' }) });
  const choice = page.getByLabel('Week 2: Manager 1 vs Manager 2', {
    exact: true,
  });
  await expect(choice).toBeHidden();
  await weekTwo.locator('summary').focus();
  await page.keyboard.press('Enter');
  await choice.selectOption('1');
  await expect(
    page.getByText('IN THIS SCENARIO', { exact: true }),
  ).toBeVisible();
  await expect(page.locator('.pc-scenario-feedback')).toContainText(
    '1 result picked. Your scenario is ready.',
  );
  await weekTwo.getByRole('link', { name: 'See updated odds' }).click();
  await expect(page).toHaveURL(/#pc-odds$/);
  await expect(
    page.getByRole('button', { name: 'Playoffs & last', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await choice.selectOption('');
  await expect(
    page.getByText('PUBLISHED FORECAST', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Reset everything' }),
  ).toBeDisabled();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
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
