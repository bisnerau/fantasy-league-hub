import { test, expect } from '@playwright/test';
import { halftimePublication } from '../../lib/data/halftime/publication';

test('a held report is absent from public pages and cannot be opened directly', async ({
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
  expect(response?.status()).toBe(404);
  await expect(page.locator('.halftime')).toHaveCount(0);
  expect(await response!.text()).not.toContain(
    'Apparently, the phone is charged.',
  );
  for (const path of ['/', '/season-hub']) {
    await page.goto(path);
    await expect(page.locator('a[href="/halftime"]')).toHaveCount(0);
  }
});
