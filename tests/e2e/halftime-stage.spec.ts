import { test, expect } from '@playwright/test';
import { halftimePublication } from '../../lib/data/halftime/publication';

test.beforeEach(async ({ page, context, request }) => {
  const fixture = 'http://127.0.0.1:4319';
  await request.post(`${fixture}/__fixture`, {
    data: { reset: true, previewRole: 'owner' },
  });
  await page.clock.setFixedTime(new Date('2026-09-12T12:00:00Z'));
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (['localhost', '127.0.0.1'].includes(url.hostname))
      return route.continue();
    if (
      url.hostname.endsWith('.supabase.co') ||
      url.hostname === 'fixture.invalid'
    ) {
      if (url.pathname.endsWith('/season_forecasts'))
        return route.fulfill({ json: [] });
      const response = await request.fetch(
        `${fixture}${url.pathname}${url.search}`,
        {
          method: route.request().method(),
          headers: route.request().headers(),
          data: route.request().postData() ?? undefined,
        },
      );
      return route.fulfill({ response });
    }
    return route.abort();
  });
  if (!halftimePublication.isPublic) {
    await page.goto('/matchups');
    await page.getByRole('button', { name: 'Sign in to make picks' }).click();
    await page.getByRole('combobox', { name: 'Manager', exact: true }).click();
    await page
      .getByRole('option', { name: 'Emmet Burns', exact: true })
      .click();
    await page.getByLabel('Password', { exact: true }).fill('fixture-password');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(
      page.getByRole('button', { name: 'Sign out', exact: true }),
    ).toBeVisible();
  }
  await page.goto('/halftime');
  await expect(page.locator('.ht-team-card')).toHaveCount(12);
});

test('ceremony supports timed reveal, skip, replay, interruption and evidence focus return', async ({
  page,
}) => {
  test.setTimeout(60_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page
    .getByRole('button', { name: 'Present this award', exact: true })
    .click();
  await expect(page.locator('.ht-ceremony')).toHaveAttribute(
    'data-phase',
    'nominees',
  );
  await expect(page.locator('.ht-stage-nominees')).toContainText('Jared Goff');
  await expect(page.locator('.ht-stage-screen')).toContainText(
    '86.80 points from four starts',
    { timeout: 12000 },
  );
  await page
    .getByRole('button', { name: 'Replay this award', exact: true })
    .click();
  await page
    .getByRole('button', { name: '02 Schedule Solicitor', exact: true })
    .click();
  await page.waitForTimeout(9000);
  await expect(page.locator('.ht-ceremony')).toHaveAttribute(
    'data-phase',
    'ready',
  );
  await expect(page.locator('.ht-stage-screen')).not.toContainText(
    'Jared Goff',
  );
  await page
    .getByRole('button', { name: 'Present this award', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Skip to winner', exact: true })
    .click();
  await expect(page.locator('.ht-stage-screen')).toContainText('Aidan Murphy');
  const evidence = page.getByRole('button', {
    name: 'Show the evidence',
    exact: true,
  });
  await evidence.click();
  await expect(page.getByRole('dialog')).toContainText('Aidan Murphy');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(evidence).toBeFocused();
  await page
    .getByRole('button', { name: 'Show all results', exact: true })
    .click();
  await expect(page.locator('.ht-award-results > button')).toHaveCount(5);
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 1440]) {
  test(`rugby reveals and all five honours work without motion at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    if (!halftimePublication.isPublic)
      await expect(page.getByLabel('CHOOSE A MANAGER')).toHaveValue('1');
    await page.getByLabel('CHOOSE A MANAGER').selectOption('4');
    await page
      .getByRole('button', { name: 'Reveal the comparison', exact: true })
      .click();
    await expect(page.getByRole('dialog')).toContainText('Jacob Stockdale');
    await expect(page.locator('.ht-rugby-green')).toContainText('2019');
    await page
      .getByRole('button', { name: 'Replay the jersey switch', exact: true })
      .click();
    await expect(page.locator('.ht-rugby-blue')).toContainText('Tommy O’Brien');
    await page
      .getByRole('button', { name: 'Who are you now?', exact: true })
      .click();
    await expect(page.locator('.ht-rugby-green')).toContainText(
      'Jacob Stockdale',
    );
    expect(
      await page
        .getByRole('dialog')
        .evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
    await page
      .getByRole('button', { name: 'Close team report', exact: true })
      .click();
    const winners = [
      'Jared Goff',
      'Aidan Murphy',
      'David Sharpe',
      'The Burns forecast',
      'Shane Marmion',
    ];
    for (let i = 0; i < 5; i++) {
      await page.locator('.ht-award-programme > button').nth(i).click();
      await page
        .getByRole('button', { name: 'Present this award', exact: true })
        .click();
      await expect(page.locator('.ht-ceremony')).toHaveAttribute(
        'data-phase',
        'winner',
      );
      await expect(page.locator('.ht-stage-screen')).toContainText(winners[i]);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(await page.locator('audio,video').count()).toBe(0);
  });
}

test('the on-page motion switch completes an active reveal immediately', async ({
  page,
}) => {
  await page
    .getByRole('button', { name: 'Present this award', exact: true })
    .click();
  await page.getByRole('button', { name: 'Motion on', exact: true }).click();
  await expect(page.locator('.ht-ceremony')).toHaveAttribute(
    'data-phase',
    'winner',
  );
  await expect(page.locator('.ht-ceremony')).toHaveAttribute(
    'data-still',
    'true',
  );
});
