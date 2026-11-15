import { expect, test, type Page } from '@playwright/test';

const START = new Date(2026, 0, 15, 15, 25, 42);

async function rotation(page: Page, hand: string): Promise<number> {
  const transform = await page.locator(`[data-hand="${hand}"]`).getAttribute('transform');
  return Number(/rotate\(([-\d.e]+)\)/.exec(transform ?? '')?.[1]);
}

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: START });
  await page.goto('./');
});

test('REQ-FACE-001: draws 60 ticks and the numbers 1–12', async ({ page }) => {
  const svg = page.getByRole('slider', { name: /Analog clock/ });
  await expect(svg.locator('line:not([data-hand])')).toHaveCount(60);
  await expect(svg.locator('text')).toHaveText(Array.from({ length: 12 }, (_, i) => `${i + 1}`));
});

test('REQ-FACE-004/005: starts at local time and shows the phrase', async ({ page }) => {
  const phrase = page.getByTestId('time-phrase');
  await expect(phrase).toContainText("It's twenty-five past three in the afternoon");
  await expect(phrase).toContainText('and forty-two seconds');
  expect(await rotation(page, 'seconds')).toBe(252);
  expect(await rotation(page, 'minutes')).toBeCloseTo(154.2, 1);
  expect(await rotation(page, 'hours')).toBeCloseTo(102.85, 1);
});

test('REQ-FACE-004: the seconds hand advances 12° in 2 seconds', async ({ page }) => {
  await page.clock.runFor(2000);
  expect(await rotation(page, 'seconds')).toBe(264);
  await expect(page.getByTestId('time-phrase')).toContainText('and forty-four seconds');
});

test('REQ-FACE-003: hands are not styled with inline style attributes', async ({ page }) => {
  await expect(page.locator('[data-hand][style]')).toHaveCount(0);
});

test('REQ-FACE-006: fits a phone screen without horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
  await expect(page.getByRole('slider', { name: /Analog clock/ })).toBeInViewport();
  await expect(page.getByTestId('time-phrase')).toBeInViewport();
});

test('REQ-FACE-008: the selected hand is highlighted', async ({ page }) => {
  const stroke = (hand: string) =>
    page.locator(`[data-hand="${hand}"]`).evaluate((el) => getComputedStyle(el).stroke);
  const selected = await stroke('minutes');
  expect(await stroke('hours')).not.toBe(selected);
  expect(await stroke('seconds')).not.toBe(selected);
});

test('REQ-FACE-009: the phrase is not announced while running', async ({ page }) => {
  await expect(page.getByTestId('time-phrase')).toHaveAttribute('aria-live', 'off');
});
