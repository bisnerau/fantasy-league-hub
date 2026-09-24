import { test, expect, type Page } from '@playwright/test';

const fixture = 'http://127.0.0.1:4319';
const start = new Date('2026-09-12T12:00:00Z');
const pageErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page, request, context }) => {
  const errors: string[] = [];
  pageErrors.set(page, errors);
  page.on('pageerror', (error) => errors.push(error.message));
  await request.post(`${fixture}/__fixture`, { data: { reset: true } });
  await page.clock.install({ time: start });
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1' || url.hostname === 'localhost')
      return route.continue();
    if (
      url.hostname.endsWith('.supabase.co') ||
      url.hostname === 'fixture.invalid'
    ) {
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
    // Fixture QA never sends authentication or writes to an external service.
    return route.abort();
  });
});

test.afterEach(({ page }) => {
  expect(pageErrors.get(page)).toEqual([]);
});

async function signIn(page: Page) {
  await expect(page.getByText('Week 1', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Sign in to make picks' }).click();
  await page.getByRole('combobox', { name: 'Manager', exact: true }).click();
  await page.getByRole('option', { name: 'Emmet Burns', exact: true }).click();
  await expect(
    page.getByRole('combobox', { name: 'Manager', exact: true }),
  ).toContainText('Emmet Burns');
  await page.getByLabel('Password', { exact: true }).fill('fixture-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(
    page.getByText('0 of 6 picks saved', { exact: true }),
  ).toBeVisible();
}

for (const width of [320, 390, 768, 1024, 1440]) {
  for (const theme of ['dark', 'light']) {
    test(`clubhouse and picks fit ${width}px in ${theme} mode`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(
        (value) => localStorage.setItem('fantasy-theme', value),
        theme,
      );
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      for (const path of ['/', '/matchups']) {
        await page.goto(path);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expect(
          page
            .getByRole('button', { name: /Sign in to make picks/ })
            .or(page.getByRole('link', { name: /Sign in to make picks/ })),
        ).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page.screenshot({
          path: testInfo.outputPath(
            `${path === '/' ? 'clubhouse' : 'picks'}-${width}-${theme}.png`,
          ),
          fullPage: true,
        });
      }
      expect(errors).toEqual([]);
    });
  }
}

test('picks save, change, survive reload, and update the clubhouse count', async ({
  page,
  request,
}) => {
  await page.goto('/matchups');
  await signIn(page);
  await request.post(`${fixture}/__fixture`, { data: { delayVote: 600 } });
  const burns = page.getByRole('button', {
    name: 'Pick Burns XI',
    exact: true,
  });
  await burns.click();
  await expect(burns).toHaveText('Saving…');
  await expect(burns).toBeDisabled();
  await expect(
    page.getByRole('button', { name: 'Pick Burns XI, saved', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByText('1 of 6 picks saved', { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Pick Burns XI, saved', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Pick Prime Time', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Pick Prime Time, saved', exact: true }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Clubhouse', exact: true }).click();
  await expect(
    page.getByText('1 of 6 saved · Choose your Banker', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Ball on the own 33 · 5 picks from the end zone', {
      exact: true,
    }),
  ).toBeVisible();
});

test('failed and offline changes preserve the last confirmed pick', async ({
  page,
  request,
  context,
}) => {
  await page.goto('/matchups');
  await signIn(page);
  await page
    .getByRole('button', { name: 'Pick Burns XI', exact: true })
    .click();
  await expect(
    page.getByText('1 of 6 picks saved', { exact: true }),
  ).toBeVisible();
  await request.post(`${fixture}/__fixture`, { data: { failVote: true } });
  await page
    .getByRole('button', { name: 'Pick Prime Time', exact: true })
    .click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'couldn’t confirm this change' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Pick Burns XI, saved', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await context.setOffline(true);
  await page
    .getByRole('button', { name: 'Pick Prime Time', exact: true })
    .click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'You’re offline' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Pick Burns XI, saved', exact: true }),
  ).toBeVisible();
  await context.setOffline(false);
});

test('other members remain hidden until the Sunday lock and can then be revealed', async ({
  page,
  request,
}) => {
  await request.post(`${fixture}/__fixture`, { data: { otherVote: true } });
  await page.goto('/matchups');
  await signIn(page);
  await expect(page.getByText('Alan Fixture', { exact: true })).toHaveCount(0);
  await request.post(`${fixture}/__fixture`, { data: { mode: 'locked' } });
  await page.clock.fastForward(
    new Date('2026-09-13T17:00:01Z').getTime() - start.getTime(),
  );
  await expect(
    page.getByRole('heading', { name: 'Picks locked. Calls on the record.' }),
  ).toBeVisible();
  await expect(page.getByText('Alan Fixture', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Pick Burns XI', exact: true }),
  ).toHaveCount(0);
});

test('pre-draft and settled-result states do not invent current action', async ({
  page,
  request,
}) => {
  await request.post(`${fixture}/__fixture`, { data: { mode: 'predraft' } });
  await page.goto('/');
  await expect(page.getByText('Not open yet', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Visit weekly picks' }),
  ).toBeVisible();
  await request.post(`${fixture}/__fixture`, { data: { mode: 'final' } });
  await page.clock.setFixedTime(new Date('2026-09-16T10:00:00Z'));
  await page.goto('/matchups?week=1');
  await expect(
    page.getByRole('heading', { name: 'Results settled', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Final score', { exact: true })).toHaveCount(12);
  await expect(page.getByText('110.04', { exact: true })).toHaveCount(6);
  await expect(page.getByText('110.03', { exact: true })).toHaveCount(6);
  await page.setViewportSize({ width: 320, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('mobile league menu supports keyboard dismissal and working navigation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Open league navigation' });
  await menu.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(menu).toBeFocused();
  await menu.click();
  await page.getByRole('link', { name: 'Wall of shame', exact: true }).click();
  await expect(page).toHaveURL(/wall-of-shame/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('reduced motion, skip link, and offline sign-in are usable', async ({
  page,
  context,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/matchups');
  expect(
    await page
      .locator('.page-arrival')
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  await page.getByRole('button', { name: 'Sign in to make picks' }).click();
  await page.getByRole('combobox', { name: 'Manager', exact: true }).click();
  await page.getByRole('option', { name: 'Emmet Burns', exact: true }).click();
  await page.getByLabel('Password', { exact: true }).fill('fixture-password');
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'You’re offline' }),
  ).toBeVisible();
  await context.setOffline(false);
});

test('record counts and the champion shine settle on true values', async ({
  page,
}) => {
  await page.goto('/records');
  const stats = page.locator('.record-stat');
  await expect(stats).toHaveCount(3);
  for (const stat of await stats.all()) {
    const truth = await stat.locator('.sr-only').textContent();
    expect(Number(truth)).toBeGreaterThan(0);
    await expect(stat.locator('[aria-hidden="true"]')).toHaveText(truth!);
  }
  await page.goto('/');
  expect(
    await page
      .locator('.shiny-text')
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('shiny-text');
});

test('reduced motion shows final record counts and a still champion name', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/records');
  const stat = page.locator('.record-stat').first();
  await expect(stat.locator('.sr-only')).not.toBeEmpty();
  // No count runs, so the visible number is final on the first frame.
  expect(
    await stat.evaluate(
      (element) =>
        element.querySelector('[aria-hidden="true"]')!.textContent ===
        element.querySelector('.sr-only')!.textContent,
    ),
  ).toBe(true);
  await page.goto('/');
  expect(
    await page
      .locator('.shiny-text')
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none');
});

test('the phone homepage leads with the countdown and drive, hiding feeds without data', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Week 1');
  await expect(page.getByText('Picks close in', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Touchback · 80 yards to go', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Sign in to make picks/ }),
  ).toBeInViewport();
  // Week 1 has no settled week, authored flag or Match of the Week yet.
  await expect(page.locator('.league-wire')).toHaveCount(0);
  await expect(page.locator('.tear-ticket')).toHaveCount(0);
  await expect(page.locator('.flag-play')).toHaveCount(0);
  await expect(
    page.getByRole('heading', { name: 'Week 1 fixtures' }),
  ).toBeVisible();
  await expect(page.locator('.scoreboard-rail > li')).toHaveCount(6);
  await expect(page.locator('.flip-card')).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('the two-minute warning appears in the final two hours before lock', async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date('2026-09-13T16:00:00Z'));
  await page.goto('/');
  await expect(page.getByText('Two-minute warning')).toBeVisible();
  await expect(page.locator('.pick-spotlight')).toHaveClass(/warning-border/);
});

test('settled weeks flip to their round-up and feed the league wire', async ({
  page,
  request,
}) => {
  await request.post(`${fixture}/__fixture`, { data: { mode: 'final' } });
  await page.clock.setFixedTime(new Date('2026-09-16T10:00:00Z'));
  await page.goto('/');
  // The latest settled week leads the scoreboard and the wire.
  const week = (await page.getByRole('heading', { level: 1 }).textContent())!;
  await expect(
    page.getByRole('heading', { name: `${week} results` }),
  ).toBeVisible();
  await expect(
    page.getByRole('region', { name: `${week} league wire` }),
  ).toContainText(`${week} high`);
  const card = page.locator('.flip-card').first();
  const flip = card.getByRole('button', { name: /Show the round-up for/ });
  await flip.click();
  await expect(card).toHaveAttribute('data-flipped', 'true');
  await expect(
    card.getByRole('link', { name: 'See the matchup' }),
  ).toBeFocused();
  await card.getByRole('button', { name: 'Flip back' }).click();
  await expect(flip).toBeFocused();
  await page.getByRole('button', { name: 'Pause the league wire' }).click();
  await expect(
    page.getByRole('button', { name: 'Play the league wire' }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('the Wall of Shame sticker peels by tap and by keyboard', async ({
  page,
}) => {
  await page.goto('/');
  const sticker = page.getByRole('button', { name: /Wooden spoon/ });
  await expect(sticker).toHaveAttribute('aria-expanded', 'false');
  await sticker.focus();
  await page.keyboard.press('Enter');
  await expect(sticker).toHaveAttribute('aria-expanded', 'true');
  await expect(
    page.getByRole('link', { name: 'See the evidence' }),
  ).toBeFocused();
});

test('reduced motion keeps the homepage still', async ({ page, request }) => {
  await request.post(`${fixture}/__fixture`, { data: { mode: 'final' } });
  await page.clock.setFixedTime(new Date('2026-09-16T10:00:00Z'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const animation = (selector: string) =>
    page
      .locator(selector)
      .first()
      .evaluate((element) => getComputedStyle(element).animationName);
  expect(await animation('.wire-marquee')).toBe('none');
  expect(await animation('.holo-sheen')).toBe('none');
  expect(await animation('.clubhouse-field > section:not(:first-child)')).toBe(
    'none',
  );
  await expect(page.locator('.wire-toggle')).toBeHidden();
  await page.clock.setFixedTime(new Date('2026-09-12T12:00:00Z'));
  await request.post(`${fixture}/__fixture`, { data: { mode: 'open' } });
  await page.goto('/');
  expect(await animation('.split-flap-cell')).toBe('none');
});

test('member read failures disable changes and recover with Retry', async ({
  page,
  request,
}) => {
  await page.goto('/matchups');
  await signIn(page);
  await page
    .getByRole('button', { name: 'Pick Burns XI', exact: true })
    .click();
  await expect(
    page.getByText('1 of 6 picks saved', { exact: true }),
  ).toBeVisible();
  await request.post(`${fixture}/__fixture`, { data: { failRead: true } });
  await page.reload();
  await expect(
    page.getByRole('alert').filter({ hasText: 'could not be loaded' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Pick Prime Time', exact: true }),
  ).toBeDisabled();
  await request.post(`${fixture}/__fixture`, { data: { failRead: false } });
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Pick Burns XI, saved', exact: true }),
  ).toBeEnabled();
  await expect(
    page.getByText('1 of 6 picks saved', { exact: true }),
  ).toBeVisible();
});

test('a complete mobile ballot persists and signing out hides member information', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/matchups');
  await signIn(page);
  for (const [index, name] of [
    'Burns XI',
    'Mahomes-lander and The Boys',
    'Who’s throwing Diggs',
    'Tampa B’AH',
    'Pronouns Who Dey',
    'BurrowMeDickinYoAss',
  ].entries()) {
    await page
      .getByRole('button', { name: `Pick ${name}`, exact: true })
      .click();
    await expect(
      page.getByText(`${index + 1} of 6 picks saved`, { exact: true }),
    ).toBeVisible();
  }
  await page.screenshot({
    path: testInfo.outputPath('complete-mobile-ballot.png'),
    fullPage: true,
  });
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await expect(
    page.getByText('6 of 6 saved · Choose your Banker', { exact: true }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: 'Review your picks', exact: true })
    .click();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Sign in to make picks' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /, saved$/ })).toHaveCount(0);
});

test('theme changes persist and every league page is reachable without overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page
    .getByRole('button', { name: 'Toggle light and dark mode' })
    .click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  for (const [label, path] of [
    ['League standings', '/standings'],
    ['Power rankings', '/power-rankings'],
    ['Managers', '/managers'],
    ['Wall of shame', '/wall-of-shame'],
    ['Draft Report & Season Preview', '/draft-recap'],
  ]) {
    await page.getByRole('button', { name: 'Open league navigation' }).click();
    await page.getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator('body')).not.toContainText('NaN');
  }
  await page.getByRole('button', { name: 'Open league navigation' }).click();
  await page.getByRole('link', { name: 'Record book', exact: true }).click();
  await expect(page).toHaveURL(/\/records$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

for (const width of [320, 768, 1024, 1440]) {
  for (const theme of ['dark', 'light']) {
    test(`league archives fit ${width}px in ${theme} mode`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(
        (value) => localStorage.setItem('fantasy-theme', value),
        theme,
      );
      for (const path of [
        '/standings',
        '/records',
        '/managers',
        '/wall-of-shame',
        '/draft-recap',
      ]) {
        await page.goto(path);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${path} should fit ${width}px`,
        ).toBe(true);
        await expect(page.locator('body')).not.toContainText('NaN');
        if (path === '/records' || path === '/standings') {
          await page.screenshot({
            path: testInfo.outputPath(`${path.slice(1)}-${width}-${theme}.png`),
            fullPage: true,
          });
        }
      }
    });
  }
}

async function pickAndConfirm(page: Page, team: string) {
  await page.getByRole('button', { name: `Pick ${team}`, exact: true }).click();
  await expect(
    page.getByRole('button', { name: `Pick ${team}, saved`, exact: true }),
  ).toBeVisible();
}

test('hold to bank it needs a full hold, and keyboards get a confirm step', async ({
  page,
}) => {
  await page.goto('/matchups');
  await signIn(page);
  await pickAndConfirm(page, 'Burns XI');
  const hold = page.getByRole('button', {
    name: 'Make Emmet Burns your Banker',
    exact: true,
  });
  await hold.scrollIntoViewIfNeeded();
  const box = (await hold.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.clock.runFor(250);
  await page.mouse.up();
  await expect(hold).toContainText('Keep holding');
  await expect(
    page.getByText('Your Banker · 2 points if correct · Emmet Burns'),
  ).toHaveCount(0);
  await page.mouse.down();
  await page.clock.runFor(900);
  await page.mouse.up();
  await expect(
    page.getByText('Your Banker · 2 points if correct · Emmet Burns'),
  ).toBeVisible();
  await expect(page.locator('#matchup-1 .stamp')).toHaveText('Banker ×2');

  await pickAndConfirm(page, 'Mahomes-lander and The Boys');
  await page
    .getByRole('button', { name: 'Make Manager 3 your Banker', exact: true })
    .focus();
  await page.keyboard.press('Enter');
  const confirm = page.getByRole('button', {
    name: 'Bank Manager 3 ×2',
    exact: true,
  });
  await expect(confirm).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(
    page.getByText('Your Banker · 2 points if correct · Manager 3'),
  ).toBeVisible();
  await expect(
    page.getByText('Your Banker · 2 points if correct · Emmet Burns'),
  ).toHaveCount(0);
  await expect(
    page.getByRole('complementary', { name: 'Your bet slip' }),
  ).toContainText('2/6 selections · Banker: Manager 3 · Returns up to 3 pts');
});

test('the bet slip counts selections and jumps to the next open pick', async ({
  page,
}) => {
  await page.goto('/matchups');
  const slip = page.getByRole('complementary', { name: 'Your bet slip' });
  await expect(slip).toContainText('Sign in to start your slip');
  await slip.getByRole('button', { name: 'Start your slip' }).click();
  await expect(
    page.getByRole('combobox', { name: 'Manager', exact: true }),
  ).toBeFocused();
  await page.reload();
  await signIn(page);
  await expect(slip).toContainText(
    '0/6 selections · No Banker yet · Returns up to 0 pts',
  );
  await pickAndConfirm(page, 'Burns XI');
  await expect(slip).toContainText(
    '1/6 selections · No Banker yet · Returns up to 1 pt',
  );
  await slip.getByRole('button', { name: 'Next pick' }).click();
  await expect(
    page.getByRole('button', {
      name: 'Pick Mahomes-lander and The Boys',
      exact: true,
    }),
  ).toBeFocused();
});

test('the rapid-fire slip picks by swipe, button and arrow key, holding failures', async ({
  page,
  request,
}) => {
  await page.goto('/matchups');
  await signIn(page);
  await page.getByRole('button', { name: 'Rapid-fire slip' }).click();
  const deck = page.getByRole('dialog');
  await expect(
    deck.getByRole('heading', { name: '6 picks to go' }),
  ).toBeVisible();
  // Measure once the sheet has finished sliding up.
  const swipeCard = deck.locator('.swipe-card');
  await expect
    .poll(async () => {
      const before = await swipeCard.boundingBox();
      await page.waitForTimeout(100);
      const after = await swipeCard.boundingBox();
      return before?.y === after?.y;
    })
    .toBe(true);
  const card = (await swipeCard.boundingBox())!;
  await page.mouse.move(card.x + card.width / 2, card.y + card.height / 2);
  await page.mouse.down();
  for (const step of [30, 60, 90, 130])
    await page.mouse.move(
      card.x + card.width / 2 - step,
      card.y + card.height / 2,
    );
  await page.mouse.up();
  await expect(
    deck.getByRole('heading', { name: '5 picks to go' }),
  ).toBeVisible();
  await deck
    .getByRole('button', {
      name: 'Pick Mahomes-lander and The Boys',
      exact: true,
    })
    .click();
  await expect(
    deck.getByRole('heading', { name: '4 picks to go' }),
  ).toBeVisible();
  await deck
    .getByRole('button', { name: 'Pick Who’s throwing Diggs', exact: true })
    .focus();
  await page.keyboard.press('ArrowRight');
  await expect(
    deck.getByRole('heading', { name: '3 picks to go' }),
  ).toBeVisible();
  await request.post(`${fixture}/__fixture`, { data: { failVote: true } });
  await deck
    .getByRole('button', { name: 'Pick Tampa B’AH', exact: true })
    .click();
  await expect(
    deck.getByRole('alert').filter({ hasText: 'couldn’t confirm this change' }),
  ).toBeVisible();
  await expect(
    deck.getByRole('heading', { name: '3 picks to go' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(deck).toHaveCount(0);
  for (const team of [
    'Burns XI',
    'Mahomes-lander and The Boys',
    'Sauce Pjardner',
  ])
    await expect(
      page.getByRole('button', { name: `Pick ${team}, saved`, exact: true }),
    ).toBeVisible();
  await expect(
    page.getByText('3 of 6 picks saved', { exact: true }),
  ).toBeVisible();
});

test('the match programme opens report, history and lineups in a sheet', async ({
  page,
}) => {
  await page.goto('/matchups');
  await expect(
    page.getByText('Fixture quarterback 1', { exact: true }),
  ).toHaveCount(0);
  const trigger = page.getByRole('button', {
    name: 'Programme: Emmet Burns v Manager 2',
    exact: true,
  });
  await trigger.click();
  const sheet = page.getByRole('dialog');
  await expect(
    sheet.getByRole('heading', { name: 'Emmet Burns v Manager 2' }),
  ).toBeVisible();
  await sheet.getByRole('tab', { name: 'Lineups' }).click();
  await expect(
    sheet.getByText('Fixture quarterback 1', { exact: true }),
  ).toBeVisible();
  await sheet.getByRole('tab', { name: 'History' }).click();
  await expect(sheet.getByRole('tabpanel', { name: 'History' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(sheet).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('locked cards stamp your pick and show the league tug-of-war', async ({
  page,
  request,
}) => {
  await request.post(`${fixture}/__fixture`, { data: { otherVote: true } });
  await page.goto('/matchups');
  await signIn(page);
  await pickAndConfirm(page, 'Burns XI');
  await request.post(`${fixture}/__fixture`, { data: { mode: 'locked' } });
  await page.clock.fastForward(
    new Date('2026-09-13T17:00:01Z').getTime() - start.getTime(),
  );
  await expect(
    page.getByRole('heading', { name: 'Picks locked. Calls on the record.' }),
  ).toBeVisible();
  await expect(page.locator('#matchup-1 .stamp')).toHaveText('Locked');
  await expect(page.locator('#matchup-1')).toContainText('Emmet Burns 50%');
  await expect(page.getByText('Alan Fixture', { exact: true })).toBeVisible();
  await expect(page.getByText(/You can change it until/)).toHaveCount(0);
  await expect(
    page.getByRole('complementary', { name: 'Your bet slip' }),
  ).toContainText('Slip locked');
});

test('settled weeks stamp results, judge the line and print the docket', async ({
  page,
  request,
}) => {
  await page.goto('/matchups');
  await signIn(page);
  await pickAndConfirm(page, 'Burns XI');
  await pickAndConfirm(page, 'Cooper Kupp Mah Balls');
  await request.post(`${fixture}/__fixture`, { data: { mode: 'final' } });
  await page.clock.setFixedTime(new Date('2026-09-16T10:00:00Z'));
  await page.goto('/matchups?week=1');
  await expect(
    page.getByRole('heading', { name: 'Results settled', exact: true }),
  ).toBeVisible();
  await expect(page.locator('#matchup-1 .stamp')).toHaveText('Called it');
  await expect(page.locator('#matchup-2 .stamp')).toHaveText('Missed');
  await expect(page.locator('#matchup-1 .faceoff-line')).toContainText('Upset');
  await expect(
    page.getByRole('link', { name: 'Week 1, settled, 6 points' }),
  ).toHaveAttribute('aria-current', 'page');
  const toggle = page.getByRole('button', { name: 'See your docket' });
  await toggle.click();
  const docket = page.getByRole('region', { name: 'Your docket' });
  await expect(docket).toContainText('2 selections');
  await expect(docket).toContainText('Returned 6 pts');
  await expect(docket).toContainText('1st of 2');
  await expect(docket).not.toContainText('110.0');
  await docket.getByRole('button', { name: 'Tear off the docket' }).click();
  await expect(docket).toHaveCount(0);
  await expect(toggle).toBeFocused();
  await expect(page.getByText('Final score', { exact: true })).toHaveCount(12);
});

test('reduced motion swaps the hold for a confirm step and keeps stamps still', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/matchups');
  await signIn(page);
  await pickAndConfirm(page, 'Burns XI');
  await expect(page.locator('.click-spark')).toHaveCount(0);
  await page
    .getByRole('button', { name: 'Make Emmet Burns your Banker', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Bank Emmet Burns ×2', exact: true })
    .click();
  const stamp = page.locator('#matchup-1 .stamp');
  await expect(stamp).toHaveText('Banker ×2');
  expect(
    await stamp.evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none');
  expect(
    await page.evaluate(
      () =>
        getComputedStyle(document.querySelector('.faceoff')!)
          .transitionDuration,
    ),
  ).not.toBe('0.45s');
});
