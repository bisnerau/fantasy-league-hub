import { test, expect, type Page } from '@playwright/test';

const fixture = 'http://127.0.0.1:4319';
const start = new Date('2026-09-12T12:00:00Z');
const errors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page, request, context }) => {
  errors.set(page, []);
  page.on('pageerror', (error) => errors.get(page)?.push(error.message));
  await request.post(`${fixture}/__fixture`, {
    data: { reset: true, prices: true },
  });
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
    return route.abort();
  });
});

test.afterEach(({ page }) => expect(errors.get(page)).toEqual([]));

async function signIn(page: Page) {
  await expect(page.getByText('Week 1', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Sign in to make picks' }).click();
  await page.getByRole('combobox', { name: 'Manager', exact: true }).click();
  await page.getByRole('option', { name: 'Emmet Burns', exact: true }).click();
  await page.getByLabel('Password', { exact: true }).fill('fixture-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(
    page.getByText('0 of 6 picks saved', { exact: true }),
  ).toBeVisible();
}

test('a priced week shows each price, its return and a doubled Banker', async ({
  page,
}) => {
  await page.goto('/matchups');
  const card = page.locator('#matchup-1');
  await expect(card).toContainText('4/6');
  await expect(card).toContainText('returns 1.67 pts');
  await expect(card).toContainText('6/4');
  await expect(card).toContainText('returns 2.50 pts');
  await signIn(page);
  await page
    .getByRole('button', { name: 'Pick Burns XI at 4/6', exact: true })
    .click();
  await expect(
    page.getByRole('button', {
      name: 'Pick Burns XI at 4/6, saved',
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole('button', {
      name: 'Pick Mahomes-lander and The Boys at 4/6',
      exact: true,
    })
    .click();
  await expect(
    page.getByRole('button', {
      name: 'Pick Mahomes-lander and The Boys at 4/6, saved',
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Make Manager 3 your Banker', exact: true })
    .focus();
  await page.keyboard.press('Enter');
  await page
    .getByRole('button', { name: 'Bank Manager 3 ×2', exact: true })
    .click();
  await expect(
    page.getByText('Your Banker · 3.34 points if correct · Manager 3'),
  ).toBeVisible();
  const slip = page.getByRole('complementary', { name: 'Your bet slip' });
  await slip.getByRole('button', { name: 'View slip' }).click();
  const open = page.getByRole('region', { name: 'Your slip' });
  // 1.67 for Burns XI plus a doubled 1.67 Banker.
  await expect(open).toContainText('Returns up to 5.01 pts');
  await expect(open).toContainText('Emmet Burns 4/6');
});

test('the weekly table explains odds scoring in a priced week', async ({
  page,
}) => {
  await page.goto('/matchups');
  await expect(
    page.getByText(
      'Correct picks return their odds; a correct Banker pays double.',
      { exact: false },
    ),
  ).toBeVisible();
});
