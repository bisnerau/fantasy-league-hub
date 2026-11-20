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
    const picture = page.locator('.pc-playoff-picture');
    await expect(picture.locator('img')).toBeVisible();
    await expect(picture.locator('img')).toHaveJSProperty('naturalWidth', 1671);
    await expect(picture.locator('a')).toHaveAttribute(
      'href',
      '/playoffs/2026-week-11-playoff-picture.png',
    );
    await expect(picture.locator('figcaption')).toContainText(
      'Week 11 snapshot',
    );
    await expect(page.locator('main')).not.toContainText('Manager');
    await expect(page.locator('.pc-team > summary').first()).toContainText(
      'Fixture team 1',
    );
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
    const stakes = page.locator('.pc-elimination-stakes');
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
      .getByLabel('Week 1: Fixture team 1 vs Fixture team 2', { exact: true })
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
for (const width of [320, 390, 1440])
  test(`game stakes and future scenario weeks work at ${width}px`, async ({
    page,
  }) => {
    const twoWeeks = structuredClone(input);
    twoWeeks.regularSeasonWeeks = 2;
    twoWeeks.playoffTeams = 2;
    twoWeeks.teams = twoWeeks.teams.slice(0, 4);
    twoWeeks.teams.forEach((team, i) => {
      team.wins = [0, 1, 0, 4][i];
      team.rank = [3, 2, 4, 1][i];
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
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/playoff-chances');
    const stakes = page.locator('.pc-elimination-stakes');
    const manager = stakes.locator('article').filter({
      has: page.getByRole('heading', {
        name: 'Fixture team 1',
        exact: true,
        includeHidden: true,
      }),
    });
    await expect(manager.locator('li')).toHaveCount(2);
    await expect(manager.locator('.pc-stake')).toHaveCount(1);
    const bigWeeks = page.locator('.pc-stakes-week');
    await expect(bigWeeks).toHaveCount(2);
    const firstBigWeek = bigWeeks.first();
    await expect(firstBigWeek.locator('.pc-swing-game')).toHaveCount(2);
    const firstGame = firstBigWeek.locator('.pc-swing-game').filter({
      has: page.getByRole('heading', {
        name: 'Fixture team 1 vs Fixture team 2',
        exact: true,
      }),
    });
    await expect(firstGame.locator('.ui-kicker')).toHaveText(
      'Week 1 · Matchup stakes',
    );
    const playoffOdds = firstGame.getByRole('table', {
      name: 'Playoff chance · higher is better',
    });
    await expect(playoffOdds.locator('thead th')).toHaveText([
      'Team',
      'If win',
      'If lose',
    ]);
    await expect(
      page.getByRole('heading', { name: 'Must win & can’t lose', exact: true }),
    ).toBeVisible();
    await expect(playoffOdds.locator('.pc-stake-label')).toHaveText([
      'Must win',
      'Can’t lose',
    ]);
    const byeOdds = firstGame.getByRole('table', {
      name: 'Top-two bye chance · higher is better',
    });
    await expect(byeOdds.locator('.pc-stakes-probabilities td')).toHaveText([
      '43%',
      '0%',
      '90%',
      '41%',
    ]);
    await expect(byeOdds.locator('.pc-stake-label')).toHaveText([
      'Must win',
      'Can’t lose',
    ]);
    await expect(stakes.locator('summary')).toHaveText(
      'Mathematical elimination checks',
    );
    await expect(manager).toBeHidden();
    await expect(playoffOdds.locator('.pc-stakes-probabilities td')).toHaveText(
      ['43%', '0%', '90%', '41%'],
    );
    const lastOdds = firstBigWeek
      .getByRole('table', { name: 'Last-place risk · lower is better' })
      .first();
    await expect(
      lastOdds
        .locator('tbody tr')
        .filter({ hasText: 'Fixture team 2' })
        .locator('td'),
    ).toHaveText(['0%', '31%']);
    if (width === 320)
      await firstBigWeek.screenshot({
        path: '/private/tmp/mac12-expanded-stakes-320.png',
      });
    const laterGame = bigWeeks
      .nth(1)
      .locator('.pc-game-title')
      .filter({ hasText: 'Fixture team 1 vs Fixture team 2' });
    await expect(laterGame).toHaveCount(1);
    await expect(laterGame).toBeHidden();
    await bigWeeks.nth(1).locator('summary').click();
    await expect(laterGame).toBeVisible();
    const weekTwo = page
      .locator('.pc-scenario-week')
      .filter({ has: page.locator('summary').filter({ hasText: 'Week 2' }) });
    const choice = page.getByLabel('Week 2: Fixture team 1 vs Fixture team 2', {
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
    await expect(laterGame).toHaveCount(0);
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
    await expect(laterGame).toHaveCount(1);
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
