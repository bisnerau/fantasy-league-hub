import { test, expect } from '@playwright/test';
import { halftimePublication } from '../../lib/data/halftime/publication';

test('a held report is absent from public pages and requires commissioner sign-in', async ({
  page,
  context,
}) => {
  test.skip(halftimePublication.isPublic, 'The report has been announced.');
  await context.route('**/*', (route) =>
    ['localhost', '127.0.0.1'].includes(new URL(route.request().url()).hostname)
      ? route.continue()
      : route.abort(),
  );
  const response = await page.goto('/halftime');
  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole('link', { name: 'Sign in', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.halftime')).toHaveCount(0);
  expect(await response!.text()).not.toContain(
    'Apparently, the phone is charged.',
  );
  for (const path of ['/', '/season-hub']) {
    await page.goto(path);
    await expect(page.locator('a[href="/halftime"]')).toHaveCount(0);
  }
});

test('the report API verifies identity and restricts data to the commissioner', async ({
  request,
}) => {
  const fixture = 'http://127.0.0.1:4319';
  await request.post(`${fixture}/__fixture`, { data: { reset: true } });
  const deniedHeaders: Record<string, string>[] = [
    {},
    { Authorization: 'Bearer forged-token' },
  ];
  for (const headers of deniedHeaders) {
    const response = await request.get('/api/halftime-preview', { headers });
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ allowed: false });
    expect(response.headers()['cache-control']).toBe('private, no-store');
  }
  const login = await request.post(`${fixture}/auth/v1/token`, {
    data: { password: 'fixture-password' },
  });
  const { access_token } = await login.json();
  const headers = { Authorization: `Bearer ${access_token}` };
  for (const role of ['member', 'other-admin', 'unavailable']) {
    await request.post(`${fixture}/__fixture`, { data: { previewRole: role } });
    const response = await request.get('/api/halftime-preview', { headers });
    expect(response.status()).toBe(role === 'unavailable' ? 503 : 403);
    expect(await response.json()).toEqual({ allowed: false });
  }
  await request.post(`${fixture}/__fixture`, {
    data: { previewRole: 'owner' },
  });
  const access = await request.get('/api/halftime-preview?access=1', {
    headers,
  });
  expect(await access.json()).toEqual({ allowed: true });
  const report = await request.get('/api/halftime-preview', { headers });
  expect(report.status()).toBe(200);
  expect((await report.json()).report.teams).toHaveLength(12);
  expect(report.headers()['cache-control']).toBe('private, no-store');
  expect(report.headers()['vary']).toContain('Authorization');
  const anonymous = await request.get('/api/halftime-preview');
  expect(anonymous.status()).toBe(401);
});

test('commissioner sign-in opens the private report and signing out removes it', async ({
  page,
  context,
  request,
}) => {
  test.setTimeout(60_000);
  const fixture = 'http://127.0.0.1:4319';
  await request.post(`${fixture}/__fixture`, {
    data: { reset: true, previewRole: 'owner' },
  });
  await page.clock.install({ time: new Date('2026-09-12T12:00:00Z') });
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
  await page.goto('/matchups');
  await page.getByRole('button', { name: 'Sign in to make picks' }).click();
  await page.getByRole('combobox', { name: 'Manager', exact: true }).click();
  await page.getByRole('option', { name: 'Emmet Burns', exact: true }).click();
  await page.getByLabel('Password', { exact: true }).fill('fixture-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Sign out', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: 'Halftime · private preview', exact: true })
    .click();
  await expect(page.locator('.ht-team-card')).toHaveCount(12);
  await page
    .locator('.ht-team-card')
    .filter({ hasText: 'Emmet Burns' })
    .click();
  await expect(page.getByRole('dialog')).toContainText(
    'The commissioner has a case to answer.',
  );
  await page
    .getByRole('button', { name: 'Close team report', exact: true })
    .click();
  const loginPage = await context.newPage();
  await loginPage.clock.install({ time: new Date('2026-09-12T12:00:00Z') });
  await loginPage.goto('/matchups');
  await loginPage
    .getByRole('button', { name: 'Sign out', exact: true })
    .click();
  await expect(page.locator('.halftime')).toHaveCount(0);
  await expect(
    page.getByRole('link', { name: 'Sign in', exact: true }),
  ).toBeVisible();
  await expect(page.locator('a[href="/halftime"]')).toHaveCount(0);
});
