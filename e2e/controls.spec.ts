import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 0, 15, 9, 0, 0) });
  await page.goto('./');
});

test('REQ-CTRL-001/002: Minutes is selected by default and selection is exclusive', async ({
  page,
}) => {
  const hours = page.getByRole('button', { name: 'Hours' });
  const minutes = page.getByRole('button', { name: 'Minutes' });
  const seconds = page.getByRole('button', { name: 'Seconds' });

  await expect(minutes).toHaveAttribute('aria-pressed', 'true');
  await expect(hours).toHaveAttribute('aria-pressed', 'false');
  await expect(seconds).toHaveAttribute('aria-pressed', 'false');

  await hours.click();
  await expect(hours).toHaveAttribute('aria-pressed', 'true');
  await expect(minutes).toHaveAttribute('aria-pressed', 'false');

  const stroke = (hand: string) =>
    page.locator(`[data-hand="${hand}"]`).evaluate((el) => getComputedStyle(el).stroke);
  expect(await stroke('hours')).not.toBe(await stroke('minutes'));
});

test('REQ-CTRL-003/004: Pause stops the clock and Play resumes it', async ({ page }) => {
  const phrase = page.getByTestId('time-phrase');
  await page.getByRole('button', { name: 'Pause' }).click();
  const frozen = await phrase.textContent();

  await page.clock.runFor(3000);
  await expect(phrase).toHaveText(frozen ?? '');
  await expect(phrase).toHaveAttribute('aria-live', 'polite');

  await page.getByRole('button', { name: 'Play' }).click();
  await page.clock.runFor(2000);
  await expect(phrase).not.toHaveText(frozen ?? '');
  await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
});

test('REQ-CTRL-005: Day is the default and Night changes the phrase', async ({ page }) => {
  await page.getByRole('button', { name: 'Pause' }).click();
  const phrase = page.getByTestId('time-phrase');
  await expect(page.getByRole('button', { name: 'Day' })).toHaveAttribute('aria-pressed', 'true');
  await expect(phrase).toContainText("It's nine o'clock in the morning");

  await page.getByRole('button', { name: 'Night' }).click();
  await expect(phrase).toContainText("It's nine o'clock at night");
  await expect(page.getByRole('button', { name: 'Day' })).toHaveAttribute('aria-pressed', 'false');
});

test('REQ-CTRL-006: controls are keyboard operable with 44px targets', async ({ page }) => {
  const buttons = page.getByRole('button');
  await expect(buttons).toHaveCount(6);
  for (const box of await buttons.evaluateAll((els) =>
    els.map((el) => el.getBoundingClientRect()),
  )) {
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }

  const seconds = page.getByRole('button', { name: 'Seconds' });
  await seconds.focus();
  await page.keyboard.press('Enter');
  await expect(seconds).toHaveAttribute('aria-pressed', 'true');
});

test('REQ-CTRL-007: controls fit a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});
