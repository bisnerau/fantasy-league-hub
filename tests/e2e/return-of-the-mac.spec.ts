import { test, expect, type Page } from '@playwright/test';

const fixture = 'http://127.0.0.1:4319';
const episodePath = '/return-of-the-mac/2026-week-4-donta-fourmore';
const audioPath = '/audio/return-of-the-mac/2026-week-4-donta-fourmore.mp3';
const errors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page, request, context }) => {
  errors.set(page, []);
  page.on('pageerror', (error) => errors.get(page)?.push(error.message));
  await request.post(`${fixture}/__fixture`, {
    data: { reset: true, editorialNow: '2026-10-03T12:00:00Z' },
  });
  // Keep local media on the browser's native request path. Intercept only
  // external services, so real MP3 streaming is exercised without routing it.
  await context.route(
    (url) => !['127.0.0.1', 'localhost'].includes(url.hostname),
    async (route) => {
      const url = new URL(route.request().url());
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
    },
  );
});

test.afterEach(({ page }) => expect(errors.get(page)).toEqual([]));

test('homepage leads to archive and permanent episode, with no transcript or autoplay', async ({
  page,
}) => {
  await page.goto('/');
  const feature = page.getByRole('region', {
    name: 'Return of the Mac Mondays',
  });
  await expect(feature).toBeVisible();
  await expect(
    feature.getByText(/Week 4 preview\/pilot · Recorded 2 October 2026/),
  ).toBeVisible();
  await expect(
    page
      .getByRole('navigation', { name: 'Explore' })
      .getByRole('link', { name: 'Return of the Mac Mondays' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Read transcript' })).toHaveCount(
    0,
  );
  await expect(feature.locator('audio')).toHaveJSProperty('paused', true);
  await feature.getByRole('link', { name: 'All episodes' }).click();
  await expect(page).toHaveURL('/return-of-the-mac');
  await page.getByRole('link', { name: 'Listen to episode' }).click();
  await expect(page).toHaveURL(episodePath);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Donta Fourmore: the record needs correcting.',
  );
  await expect(page.locator('audio')).toHaveJSProperty('paused', true);
});

test('real MP3 plays, pauses, seeks by keyboard, ends and replays', async ({
  page,
}) => {
  await page.goto(episodePath);
  const audio = page.locator('audio');
  const light = page.locator('.mac-on-air');
  const seek = page.getByRole('slider', { name: 'Seek episode' });
  await expect(seek).toBeEnabled();
  await expect(audio).toHaveJSProperty('paused', true);
  await page.getByRole('button', { name: 'Play episode' }).click();
  await expect(light).toHaveAttribute('data-active', 'true');
  await expect
    .poll(() => audio.evaluate((node: HTMLAudioElement) => node.currentTime))
    .toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Pause episode' }).click();
  await expect(audio).toHaveJSProperty('paused', true);
  await expect(light).toHaveAttribute('data-active', 'false');
  await seek.focus();
  await seek.press('Home');
  await seek.press('ArrowRight');
  await expect
    .poll(() => audio.evaluate((node: HTMLAudioElement) => node.currentTime))
    .toBe(1);
  await page.getByRole('button', { name: 'Play episode' }).click();
  await expect(light).toHaveAttribute('data-active', 'true');
  await audio.evaluate((node: HTMLAudioElement) => {
    node.currentTime = node.duration - 0.3;
  });
  await expect(
    page.getByRole('button', { name: 'Replay episode' }),
  ).toBeVisible();
  await expect(light).toHaveAttribute('data-active', 'false');
  await page.getByRole('button', { name: 'Replay episode' }).click();
  await expect(light).toHaveAttribute('data-active', 'true');
});

test('buffering extinguishes ON AIR; a failed request can be retried', async ({
  page,
}) => {
  await page.route(`**${audioPath}`, (route) => route.abort());
  await page.goto(episodePath);
  await expect(page.getByRole('status')).toContainText(
    'The recording couldn’t be played.',
  );
  await expect(page.locator('.mac-on-air')).toHaveAttribute(
    'data-active',
    'false',
  );
  await page.unroute(`**${audioPath}`);
  await page.getByRole('button', { name: 'Retry playback' }).click();
  await expect(page.locator('.mac-on-air')).toHaveAttribute(
    'data-active',
    'true',
  );
  await expect
    .poll(() =>
      page
        .locator('audio')
        .evaluate((node: HTMLAudioElement) => node.currentTime),
    )
    .toBeGreaterThan(0);
  // Deterministic buffering signal; the actual play/retry above uses the MP3.
  await page.locator('audio').evaluate((node: HTMLAudioElement) => {
    node.dispatchEvent(new Event('waiting'));
  });
  await expect(page.locator('.mac-on-air')).toHaveAttribute(
    'data-active',
    'false',
  );
  await expect(page.getByRole('status')).toContainText('Loading recording');
  await page.getByRole('button', { name: 'Pause episode' }).click();
  await expect(page.locator('audio')).toHaveJSProperty('paused', true);
});

test('missing and not-yet-published episodes are unavailable', async ({
  page,
  request,
}) => {
  const missing = await page.goto('/return-of-the-mac/missing');
  expect(missing?.status()).toBe(404);
  await request.post(`${fixture}/__fixture`, {
    data: { editorialNow: '2026-10-01T12:00:00Z' },
  });
  const future = await page.goto(episodePath);
  expect(future?.status()).toBe(404);
  await page.goto('/return-of-the-mac');
  await expect(
    page.getByText('The first broadcast is still to come.'),
  ).toBeVisible();
  await page.goto('/');
  await expect(
    page.getByRole('region', { name: 'Return of the Mac Mondays' }),
  ).toHaveCount(0);
});

for (const width of [320, 390, 768, 1024, 1440]) {
  for (const theme of ['dark', 'light']) {
    test(`broadcast and archive fit ${width}px in ${theme} mode`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(
        (value) => localStorage.setItem('fantasy-theme', value),
        theme,
      );
      for (const path of ['/', '/return-of-the-mac', episodePath]) {
        await page.goto(path);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        if (path !== '/return-of-the-mac') {
          const portrait = page.locator('.mac-portrait img');
          await expect(portrait).toBeVisible();
          const box = await portrait.boundingBox();
          expect(box!.width / box!.height).toBeCloseTo(4 / 3, 1);
          await page.locator('.mac-broadcast').screenshot({
            path: testInfo.outputPath(
              `${path === '/' ? 'home' : 'episode'}-${width}-${theme}.png`,
            ),
          });
        } else {
          await page.screenshot({
            path: testInfo.outputPath(`archive-${width}-${theme}.png`),
            fullPage: true,
          });
        }
      }
    });
  }
}
