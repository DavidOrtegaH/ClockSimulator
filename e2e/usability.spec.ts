import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 0, 15, 15, 25, 42) });
  await page.goto('./');
});

test('REQ-UX-001: keyboard shortcuts drive every control', async ({ page }) => {
  const pressed = (name: string) => page.getByRole('button', { name, exact: true });

  await page.keyboard.press('h');
  await expect(pressed('Hours')).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('s');
  await expect(pressed('Seconds')).toHaveAttribute('aria-pressed', 'true');

  await page.keyboard.press('Space');
  await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
  await page.keyboard.press('k');
  await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();

  await page.keyboard.press('n');
  await expect(pressed('Night')).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('d');
  await expect(pressed('Day')).toHaveAttribute('aria-pressed', 'true');

  // Modifiers are left to the browser.
  await page.keyboard.press('Control+m');
  await expect(pressed('Seconds')).toHaveAttribute('aria-pressed', 'true');
});

test('REQ-UX-001: Space on a focused button toggles only once', async ({ page }) => {
  const pause = page.getByRole('button', { name: 'Pause' });
  await pause.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
});

test('REQ-UX-002: controls advertise their shortcuts', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Hours' })).toHaveAttribute(
    'aria-keyshortcuts',
    'H',
  );
  await expect(page.getByRole('button', { name: 'Pause' })).toHaveAttribute(
    'aria-keyshortcuts',
    'Space K',
  );
  await expect(page.getByRole('button', { name: 'Now' })).toHaveAttribute('title', /\(T\)/);
});

test('REQ-UX-003: Now returns to the device time and keeps running', async ({ page }) => {
  const phrase = page.getByTestId('time-phrase');
  const dial = page.getByRole('slider', { name: /Analog clock/ });
  await page.keyboard.press('h');
  await dial.focus();
  await page.keyboard.press('PageUp');
  await expect(phrase).toContainText('past eight');

  await page.getByRole('button', { name: 'Now' }).click();
  await expect(phrase).toContainText("It's twenty-five past three in the afternoon");
  await expect(page.getByRole('button', { name: 'Hours' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
});

test('REQ-UX-004: the slider does not announce seconds while running', async ({ page }) => {
  const dial = page.getByRole('slider', { name: /Analog clock/ });
  await expect(dial).toHaveAttribute(
    'aria-valuetext',
    "It's twenty-five past three in the afternoon",
  );
  await page.keyboard.press('s');
  await expect(dial).toHaveAttribute('aria-valuetext', /and forty-\w+ seconds$/);
});

test('REQ-UX-005: long-press on the dial does not open the context menu', async ({ page }) => {
  const prevented = await page
    .getByRole('slider', { name: /Analog clock/ })
    .evaluate(
      (el) => !el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true })),
    );
  expect(prevented).toBe(true);
});

test('REQ-UX-006/007: installable and shareable metadata', async ({ page, request }) => {
  const href = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(href).toBeTruthy();
  const manifest = await (await request.get(new URL(href ?? '', page.url()).toString())).json();
  expect(manifest).toMatchObject({
    name: 'Clock Simulator',
    display: 'standalone',
    start_url: '.',
  });
  expect(manifest.icons.length).toBeGreaterThan(0);

  await expect(page.locator('meta[name="theme-color"]').first()).toHaveAttribute('content', /#/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'Clock Simulator',
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
  await expect(page.locator('noscript')).toHaveCount(1);
});
