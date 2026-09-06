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
  await expect(page.getByText('1 of 6 saved', { exact: true })).toBeVisible();
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
  await expect(page.getByText('6 of 6 saved', { exact: true })).toBeVisible();
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
    ['Managers', '/managers'],
    ['Wall of shame', '/wall-of-shame'],
    ['Draft report', '/draft-recap'],
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
  await page.getByRole('link', { name: 'Records', exact: true }).click();
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
