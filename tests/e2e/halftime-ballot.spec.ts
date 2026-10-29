import {
  test,
  expect,
  type APIRequestContext,
  type Page,
} from '@playwright/test';

const fixture = 'http://127.0.0.1:4319';
const memberId = '11111111-1111-4111-8111-111111111111';
const otherId = '22222222-2222-4222-8222-222222222222';
// Optional screenshots for design review: SHOT_DIR=/path npx playwright test …
const review = Boolean(process.env.SHOT_DIR);
if (review)
  test.use({
    viewport: { width: 390, height: 844 },
    video: { mode: 'on', size: { width: 390, height: 844 } },
  });
const shot = async (page: Page, name: string, target = '.ht-ballot') => {
  if (!process.env.SHOT_DIR) return;
  await page.locator(target).scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${process.env.SHOT_DIR}/${name}.png` });
};

test.beforeEach(async ({ context, request }) => {
  await request.post(`${fixture}/__fixture`, {
    data: { reset: true, previewRole: 'owner' },
  });
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
            {
              voter_id: otherId,
              rankings: [5, 1, 3, 4, 2, 6, 7, 8, 9, 10, 11, 12],
            },
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
});

// Signs in as the commissioner and opens the ballot. The fixture's session
// lifetime follows its own clock, so a post-lock visit moves both clocks.
async function open(page: Page, request: APIRequestContext, when?: string) {
  // Review captures run on the real clock (before the lock) so Motion's
  // springs animate exactly as they would on a phone.
  const at = when ?? (review ? new Date().toISOString() : undefined);
  if (at)
    await request.post(`${fixture}/__fixture`, { data: { editorialNow: at } });
  // Review captures shift only Date.now: Playwright's installed clock
  // stalls Motion's animations.
  if (review && when)
    await page.addInitScript((t) => {
      const offset = Date.parse(t) - Date.now();
      const real = Date.now.bind(Date);
      Date.now = () => real() + offset;
    }, when);
  else if (!review)
    await page.clock.setFixedTime(new Date(when ?? '2026-09-12T12:00:00Z'));
  // Review captures keep motion on so the recording shows it.
  if (!review) await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/matchups');
  await page.getByRole('button', { name: 'Sign in to make picks' }).click();
  await page.getByRole('combobox', { name: 'Manager', exact: true }).click();
  await page.getByRole('option', { name: 'Emmet Burns', exact: true }).click();
  await page.getByLabel('Password', { exact: true }).fill('fixture-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Sign out', exact: true }),
  ).toBeVisible();
  await page.goto('/halftime#second-half');
  await expect(page.locator('.ht-team-card')).toHaveCount(12);
}

async function pickEveryGame(page: Page) {
  for (let i = 0; i < 5; i++)
    await page
      .locator('.ht-bk-game')
      .nth(i)
      .locator('.ht-bk-slot')
      .first()
      .click();
}

test('a manager builds, files and reopens a second-half ballot', async ({
  page,
  request,
}) => {
  await open(page, request);
  const ballot = page.locator('.ht-ballot');
  await expect(ballot.getByText('How will the table finish?')).toBeVisible();
  await expect(ballot.locator('.ht-ballot-row')).toHaveCount(12);
  await expect(ballot.getByText('Mackorcle’s ballot')).toHaveCount(0);
  await shot(page, 'ballot-table');

  // Nudge third place up to second; the playoff line stays under sixth.
  const third = ballot.locator('.ht-ballot-row').nth(2);
  const thirdName = await third.locator('strong').textContent();
  await third.getByRole('button', { name: /up to 2$/ }).click();
  await expect(ballot.locator('.ht-ballot-row').nth(1)).toContainText(
    thirdName!,
  );
  await expect(ballot.locator('.ht-ballot-row').nth(5)).toHaveClass(
    /ht-ballot-cut/,
  );

  await ballot.getByRole('button', { name: 'Pick the playoffs' }).click();
  await expect(ballot.getByText('Pick every playoff game.')).toBeVisible();
  await expect(
    ballot.getByRole('button', { name: '5 games to pick' }),
  ).toBeDisabled();
  await pickEveryGame(page);
  await expect(
    ballot.locator('.ht-bk-result[data-filled="true"]'),
  ).toContainText(/\S/);
  await shot(page, 'ballot-championship');
  await ballot.getByRole('button', { name: 'On to the loser bowl' }).click();

  await expect(ballot.getByText('Now the loser bowl.')).toBeVisible();
  await pickEveryGame(page);
  await expect(ballot.getByText('Last one standing')).toBeVisible();
  await expect(
    ballot.locator('.ht-bk-result[data-filled="true"]'),
  ).toBeVisible();
  await shot(page, 'ballot-loser-bowl');
  await ballot.getByRole('button', { name: 'Review my ballot' }).click();
  await shot(page, 'ballot-review');
  await ballot.getByRole('button', { name: 'File my ballot' }).click();

  await expect(ballot.getByText('Your ballot is filed.')).toBeVisible();
  await expect(ballot.getByText('1 of 12 filed')).toBeVisible();
  // Filing unlocks the house call.
  await expect(ballot.getByText('Mackorcle’s ballot')).toBeVisible();
  await shot(page, 'ballot-house', '.ht-ballot-house-reveal');
  await shot(page, 'ballot-filed');

  // A reload reads the stored ballot back; editing starts from it.
  await page.reload();
  await expect(ballot.getByText('Your ballot is filed.')).toBeVisible();
  await ballot.getByRole('button', { name: 'Change my ballot' }).click();
  await ballot.getByRole('button', { name: 'Championship' }).click();
  await expect(ballot.locator('.ht-bk-slot[aria-pressed="true"]')).toHaveCount(
    5,
  );
  await ballot.getByRole('button', { name: 'Keep my filed ballot' }).click();
  await expect(ballot.getByText('Your ballot is filed.')).toBeVisible();
});

test('reseeding the table clears bracket picks that no longer fit', async ({
  page,
  request,
}) => {
  await open(page, request);
  const ballot = page.locator('.ht-ballot');
  await ballot.getByRole('button', { name: 'Pick the playoffs' }).click();
  await pickEveryGame(page);
  await ballot.getByRole('button', { name: 'Table' }).click();
  // Swap the top two seeds: each bye team moves to the other semi-final.
  await ballot
    .locator('.ht-ballot-row')
    .nth(0)
    .getByRole('button', { name: /down to 2$/ })
    .click();
  await expect(ballot.locator('.ht-ballot-note')).toContainText('clears');
  // Moving them back restores the order and keeps every pick.
  await ballot
    .locator('.ht-ballot-row')
    .nth(0)
    .getByRole('button', { name: /down to 2$/ })
    .click();
  await expect(ballot.locator('.ht-ballot-note')).toHaveCount(0);
  await ballot.getByRole('button', { name: 'Championship' }).click();
  await expect(ballot.locator('.ht-bk-slot[aria-pressed="true"]')).toHaveCount(
    5,
  );
});

test('after the lock every ballot and Mackorcle’s are revealed', async ({
  page,
  request,
}) => {
  await request.post(`${fixture}/__fixture`, {
    data: {
      halftimeLocked: true,
      halftimeBallots: [
        {
          voter_id: memberId,
          rankings: [10, 1, 6, 5, 12, 9, 7, 3, 11, 2, 4, 8],
          championship: [12, 6, 10, 1, 1],
          loser_bowl: [11, 2, 11, 2, 11],
        },
        {
          voter_id: otherId,
          rankings: [10, 5, 9, 6, 3, 11, 12, 7, 2, 1, 8, 4],
          championship: [6, 9, 10, 5, 10],
          loser_bowl: [2, 1, 4, 1, 1],
        },
      ],
    },
  });
  await open(page, request, '2026-11-02T12:00:00Z');
  const ballot = page.locator('.ht-ballot');
  await expect(
    ballot.getByText('Locked · every ballot revealed'),
  ).toBeVisible();
  await expect(ballot.getByText('The room’s champion')).toBeVisible();
  await expect(ballot.getByText('Mackorcle’s ballot')).toBeVisible();
  await expect(
    ballot.getByText('Every manager’s call · 2 filed'),
  ).toBeVisible();
  await ballot.getByRole('button', { name: /Alan Fixture/ }).click();
  await expect(ballot.getByText(/Change of heart/)).toBeVisible();
  // Revealed brackets scroll in their own lane; the page never widens.
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(0);
  await shot(page, 'ballot-revealed');
});

for (const width of [320, 390]) {
  test(`the ballot fits a ${width}px phone`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 800 });
    await open(page, request);
    const pageOverflow = () =>
      page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
    await page.locator('#second-half').scrollIntoViewIfNeeded();
    expect(await pageOverflow()).toBeLessThanOrEqual(0);
    await page.getByRole('button', { name: 'Pick the playoffs' }).click();
    // The bracket scrolls sideways in its own lane; the page never does.
    expect(await pageOverflow()).toBeLessThanOrEqual(0);
    const lane = page.locator('.ht-bk-scroll');
    expect(
      await lane.evaluate((node) => node.scrollWidth > node.clientWidth),
    ).toBe(true);
    // Finishing Week 15 brings Week 16 into view.
    await page
      .locator('.ht-bk-game')
      .nth(0)
      .locator('.ht-bk-slot')
      .first()
      .click();
    await page
      .locator('.ht-bk-game')
      .nth(1)
      .locator('.ht-bk-slot')
      .first()
      .click();
    await expect
      .poll(() => lane.evaluate((node) => node.scrollLeft))
      .toBeGreaterThan(100);
  });
}

test('the hero opens with the signed-in manager’s own half', async ({
  page,
  request,
}) => {
  await open(page, request);
  const mine = page.locator('.ht-your-half');
  await expect(mine).toContainText('Burns XI');
  await expect(mine).toContainText('10th at halfway · the AI said 2nd');
  // The fixture's only September ballot belongs to another manager.
  await expect(mine).toContainText('No ballot filed');
  await expect(mine).toContainText('Not filed · locks Sun 18:00');
  // Following defaults to your own team until you choose another.
  await expect(page.locator('.ht-team-card.ht-followed')).toContainText(
    'Burns XI',
  );
  await shot(page, 'opener', '.ht-your-half');
  await mine.getByRole('button', { name: /Open your report/ }).click();
  await expect(page.getByRole('dialog')).toContainText('Burns XI');
  await page.keyboard.press('Escape');

  const ballot = page.locator('.ht-ballot');
  await ballot.getByRole('button', { name: 'Pick the playoffs' }).click();
  await pickEveryGame(page);
  await ballot.getByRole('button', { name: 'On to the loser bowl' }).click();
  await pickEveryGame(page);
  await ballot.getByRole('button', { name: 'Review my ballot' }).click();
  await ballot.getByRole('button', { name: 'File my ballot' }).click();
  await expect(mine).toContainText('Filed · change it until the lock');
});

test('keyboard moves keep focus on the team that moved', async ({
  page,
  request,
}) => {
  await open(page, request);
  const ballot = page.locator('.ht-ballot');
  const eleventh = ballot.locator('.ht-ballot-row').nth(10);
  const name = await eleventh.locator('strong').textContent();
  await eleventh.getByRole('button', { name: /down to 12$/ }).focus();
  await page.keyboard.press('Enter');
  // Now last: its down button is disabled, so focus moves to its up button.
  const last = ballot.locator('.ht-ballot-row').nth(11);
  await expect(last).toContainText(name!);
  await expect(last.getByRole('button', { name: /up to 11$/ })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(ballot.locator('.ht-ballot-row').nth(10)).toContainText(name!);
  await expect(
    ballot
      .locator('.ht-ballot-row')
      .nth(10)
      .getByRole('button', { name: /up to 10$/ }),
  ).toBeFocused();
});
