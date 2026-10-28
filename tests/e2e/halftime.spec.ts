import { test, expect } from '@playwright/test';
import { halftimePublication } from '../../lib/data/halftime/publication';

test.beforeEach(async ({ context }) => {
  test.skip(
    !halftimePublication.isPublic,
    'The public report is held for the commissioner’s announcement.',
  );
  // This design test cannot send credentials or writes to a real service.
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    return ['localhost', '127.0.0.1'].includes(url.hostname)
      ? route.continue()
      : route.abort();
  });
});

test('published honours open their evidence and the share image is available', async ({
  page,
  request,
}) => {
  await page.goto('/halftime');
  await expect(page.locator('.ht-edition')).toContainText('HALFTIME EDITION');
  await expect(
    page.locator('meta[name="robots"][content*="noindex"]'),
  ).toHaveCount(0);
  await expect(
    page.locator('meta[property="og:image"]').first(),
  ).toHaveAttribute('content', /2026-halftime-og.png$/);
  const image = await request.get('/images/halftime/2026-halftime-og.png');
  expect(image.ok()).toBe(true);
  const png = await image.body();
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
  for (const [award, manager] of [
    ['Team of the half', 'Shane Marmion'],
    ['Pickup of the half', 'Andrew Keenan'],
    ['Biggest AI miss', 'Emmet Burns'],
  ]) {
    const card = page.locator('.ht-honour').filter({ hasText: award });
    await card.click();
    await expect(page.getByRole('dialog')).toContainText(manager);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(card).toBeFocused();
  }
  await page.goto('/season-hub');
  await expect(
    page.getByRole('link', { name: 'Read the Halftime Show', exact: true }),
  ).toHaveAttribute('href', '/halftime');
});

for (const width of [320, 390, 1440]) {
  test(`halftime replay, dossiers and receipts work at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/halftime');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'THEHALFTIMESHOW.',
    );
    await expect(page.locator('.ht-team-card')).toHaveCount(12);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByRole('option', { name: 'Managers’ consensus', exact: true }),
    ).toHaveAttribute('disabled', '');
    await page
      .getByRole('button', { name: 'Reveal Week 7', exact: true })
      .click();
    const keenan = page.getByRole('button', {
      name: 'Andrew Keenan, Week 7 position 5. Open team report',
      exact: true,
    });
    await expect(keenan).toBeEnabled();
    const names = await page
      .locator('.ht-rank-row')
      .evaluateAll((rows) =>
        [...rows]
          .sort(
            (a, b) =>
              a.getBoundingClientRect().top - b.getBoundingClientRect().top,
          )
          .map((row) => row.getAttribute('aria-label')),
      );
    expect(names[0]).toContain('Shane Marmion');
    expect(names[11]).toContain('Tommy O’Brien');
    await keenan.click();
    await expect(page.getByRole('dialog')).toContainText(
      'Twelfth would like a word.',
    );
    await page.getByText('Pull the preseason receipt', { exact: true }).click();
    await expect(
      page.getByRole('dialog').getByText(/Twelfth is a close-call forecast/),
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(keenan).toBeFocused();
    await page
      .getByRole('button', { name: 'All-play table', exact: true })
      .click();
    await expect(
      page.getByRole('button', { name: 'All-play table', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
    await page
      .getByRole('button', { name: 'The verdict', exact: true })
      .click();
    await expect(
      page.getByText('APOLOGY ISSUED', { exact: true }),
    ).toBeVisible();
    await page
      .getByRole('button', {
        name: 'Emmet Burns Predicted #2 → actual #10',
        exact: true,
      })
      .click();
    await expect(page.locator('.ht-paper')).toContainText(
      'Second is a forecast of the whole Burns operation',
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('halftime honours reduced motion and its manual motion switch', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/halftime');
  expect(
    await page
      .locator('.ht-hero h1>span')
      .first()
      .evaluate((node) => getComputedStyle(node).animationName),
  ).toBe('none');
  expect(
    await page
      .locator('.ht-rank-row')
      .first()
      .evaluate((node) => getComputedStyle(node).transitionDuration),
  ).toBe('0s');
  await page.getByRole('button', { name: 'Motion on', exact: true }).click();
  await expect(page.locator('.halftime')).toHaveAttribute(
    'data-motion',
    'paused',
  );
});

test('follow, find, skip and the transaction evidence work together', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/halftime');
  await page.getByLabel('Follow a team', { exact: true }).selectOption('1');
  await expect(page.locator('.ht-rank-row.ht-followed')).toContainText(
    'Emmet Burns',
  );
  await page
    .getByRole('button', { name: 'Reveal Week 7', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Skip animation', exact: true })
    .click();
  await expect(page.locator('.ht-rank-row.ht-followed')).toContainText('10');
  await page
    .getByRole('searchbox', { name: 'FIND YOUR TEAM', exact: true })
    .fill('keenan');
  await expect(page.locator('.ht-team-card')).toHaveCount(1);
  await page
    .getByRole('button', { name: 'Show everyone', exact: true })
    .click();
  await expect(page.locator('.ht-team-card')).toHaveCount(12);
  await page.getByRole('button', { name: 'FAAB returns', exact: true }).click();
  await expect(page.locator('.ht-faab-table')).toContainText('Pending');
  await page
    .getByRole('button', { name: 'Built or bought?', exact: true })
    .click();
  await expect(page.locator('.ht-origins-list>article')).toHaveCount(12);
  await expect(page.locator('.ht-trade-evidence')).toContainText(
    'Too early for a full-week review',
  );
  await page.getByRole('button', { name: 'Best pickups', exact: true }).click();
  await page.getByRole('button', { name: /Jared Goff Andrew Keenan/ }).click();
  await expect(page.locator('.ht-pickup-evidence')).toContainText(
    'THE SCORING RECEIPT',
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('a report opens from its card, restores focus and saves a portrait PNG', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/halftime');
  const card = page
    .locator('.ht-team-card')
    .filter({ hasText: 'Niall Murray' });
  await card.click();
  await expect(page.getByRole('dialog')).toContainText(
    'Mahomes-lander n The Boys',
  );
  const download = page.waitForEvent('download');
  await page
    .getByRole('button', { name: 'Save report card', exact: true })
    .click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('mac12-halftime-niall-murray.png');
  await file.saveAs(test.info().outputPath('report-card.png'));
  const path = await file.path();
  const { readFile } = await import('node:fs/promises');
  const png = await readFile(path!);
  expect(png.readUInt32BE(16)).toBe(1080);
  expect(png.readUInt32BE(20)).toBe(1350);
  await page
    .getByRole('button', { name: 'Close team report', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(card).toBeFocused();
  expect(errors).toEqual([]);
});

test('member receipts use only complete submissions and clear after sign-out', async ({
  page,
  context,
  request,
}) => {
  const fixture = 'http://127.0.0.1:4319';
  await request.post(`${fixture}/__fixture`, { data: { reset: true } });
  await page.clock.install({ time: new Date('2026-09-12T12:00:00Z') });
  const ids = Array.from({ length: 12 }, (_, i) => i + 1);
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (['localhost', '127.0.0.1'].includes(url.hostname))
      return route.continue();
    if (
      url.hostname.endsWith('.supabase.co') ||
      url.hostname === 'fixture.invalid'
    ) {
      if (url.pathname.endsWith('/season_forecasts'))
        return route.fulfill({
          json: [
            { voter_id: '11111111-1111-4111-8111-111111111111', rankings: ids },
            {
              voter_id: '22222222-2222-4222-8222-222222222222',
              rankings: [...ids].reverse(),
            },
            { voter_id: 'incomplete', rankings: [1, 2] },
          ],
        });
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
  await page.goto('/matchups');
  await page.getByRole('button', { name: 'Sign in to make picks' }).click();
  await page.getByRole('combobox', { name: 'Manager', exact: true }).click();
  await page.getByRole('option', { name: 'Emmet Burns', exact: true }).click();
  await page.getByLabel('Password', { exact: true }).fill('fixture-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Sign out', exact: true }),
  ).toBeVisible();
  await page.goto('/halftime');
  await expect(page.locator('.ht-participation')).toHaveText('2/12 submitted');
  await expect(page.locator('.ht-forecast-race>div>button')).toHaveCount(3);
  await page
    .getByLabel('Prediction source', { exact: true })
    .selectOption('consensus');
  await expect(
    page.getByLabel('Prediction source', { exact: true }),
  ).toHaveValue('consensus');
  await page.getByRole('button', { name: /The AI ORIGINAL FORECAST/ }).click();
  await expect(page.locator('.ht-ballot-detail')).toContainText(
    'the original ballot against Week 7',
  );
  await page.goto('/matchups');
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.goto('/halftime');
  await expect(page.locator('.ht-manager-receipts')).toContainText(
    'Sign in to see',
  );
  await expect(page.locator('.ht-forecast-race')).toHaveCount(0);
});
