import { expect, test, type Page } from '@playwright/test';

/** Screen point at `angle` degrees clockwise from 12, `factor` of the dial radius out. */
async function dialPoint(page: Page, angle: number, factor = 0.6) {
  const box = await page.getByRole('slider', { name: /Analog clock/ }).boundingBox();
  if (!box) throw new Error('Dial not visible');
  const r = (box.width / 2) * factor;
  const rad = (angle * Math.PI) / 180;
  return {
    x: box.x + box.width / 2 + r * Math.sin(rad),
    y: box.y + box.height / 2 - r * Math.cos(rad),
  };
}

async function rotation(page: Page, hand: string): Promise<number> {
  const transform = await page.locator(`[data-hand="${hand}"]`).getAttribute('transform');
  return Number(/rotate\(([-\d.e]+)\)/.exec(transform ?? '')?.[1]);
}

/** Smallest absolute difference between two angles. */
function angularGap(a: number, b: number): number {
  const d = Math.abs((((a - b) % 360) + 360) % 360);
  return Math.min(d, 360 - d);
}

async function expectAngle(page: Page, hand: string, expected: number, tolerance: number) {
  expect(angularGap(await rotation(page, hand), expected)).toBeLessThanOrEqual(tolerance);
}

async function drag(page: Page, angles: number[]) {
  const [first, ...rest] = angles;
  const start = await dialPoint(page, first ?? 0);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  for (const angle of rest) {
    const p = await dialPoint(page, angle);
    await page.mouse.move(p.x, p.y, { steps: 3 });
  }
  await page.mouse.up();
}

async function setUp(page: Page, h: number, m: number, pause = true) {
  await page.clock.install({ time: new Date(2026, 0, 15, h, m, 0) });
  await page.goto('./');
  if (pause) await page.getByRole('button', { name: 'Pause' }).click();
}

test('REQ-DRAG-002/003: pressing at 3 sets the minute hand and drags the hour hand', async ({
  page,
}) => {
  await setUp(page, 15, 0);
  await drag(page, [90]);
  await expectAngle(page, 'minutes', 90, 1.5);
  await expectAngle(page, 'hours', 97.5, 0.5);
  await expect(page.getByTestId('time-phrase')).toContainText(/quarter past three|past three/);
});

test('REQ-DRAG-003: dragging the minute hand past 12 advances the hour', async ({ page }) => {
  await setUp(page, 15, 50);
  await drag(page, [300, 330, 0, 30, 60]);
  await expectAngle(page, 'minutes', 60, 1.5);
  await expectAngle(page, 'hours', 125, 0.5);
  await expect(page.getByTestId('time-phrase')).toContainText('past four');
});

test('REQ-DRAG-003: the hour hand carries the minute hand with it', async ({ page }) => {
  await setUp(page, 15, 0);
  await page.getByRole('button', { name: 'Hours' }).click();
  await drag(page, [90, 120, 150, 180]);
  await expectAngle(page, 'hours', 180, 0.5);
  await expectAngle(page, 'minutes', 0, 6);
});

test('REQ-DRAG-003: the seconds hand takes the shortest way round', async ({ page }) => {
  await setUp(page, 15, 0);
  await page.getByRole('button', { name: 'Seconds' }).click();
  await drag(page, [270]);
  await expectAngle(page, 'seconds', 270, 6);
  await expect(page.getByTestId('time-phrase')).toContainText(/to three|past two/);
});

test('REQ-DRAG-004: the clock holds still while dragging and resumes after', async ({ page }) => {
  await setUp(page, 15, 0, false);
  const phrase = page.getByTestId('time-phrase');
  const p = await dialPoint(page, 90);
  await page.mouse.move(p.x, p.y);
  await page.mouse.down();
  const held = await phrase.textContent();
  await page.clock.runFor(2000);
  await expect(phrase).toHaveText(held ?? '');
  await page.mouse.up();
  await page.clock.runFor(2000);
  await expect(phrase).not.toHaveText(held ?? '');
});

test('REQ-DRAG-005: a touch drag moves the hand without scrolling the page', async ({
  page,
  hasTouch,
}) => {
  test.skip(!hasTouch, 'touch-only scenario');
  await setUp(page, 15, 0);
  const dial = page.getByRole('slider', { name: /Analog clock/ });
  await expect(dial).toHaveCSS('touch-action', 'none');

  const cdp = await page.context().newCDPSession(page);
  const touch = async (type: string, angle?: number) => {
    const points = angle === undefined ? [] : [await dialPoint(page, angle)];
    await cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points } as never);
  };
  await touch('touchStart', 0);
  for (const angle of [15, 30, 45, 60, 75, 90]) await touch('touchMove', angle);
  await touch('touchEnd');

  await expectAngle(page, 'minutes', 90, 1.5);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test('REQ-DRAG-007: arrow keys step the selected hand', async ({ page }) => {
  await setUp(page, 15, 0);
  const dial = page.getByRole('slider', { name: /Analog clock/ });
  await dial.focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  const phrase = page.getByTestId('time-phrase');
  await expect(phrase).toContainText("It's two minutes past three in the afternoon");
  await expect(dial).toHaveAttribute('aria-valuetext', /^It's two minutes past three/);

  await page.getByRole('button', { name: 'Hours' }).click();
  await dial.focus();
  await page.keyboard.press('PageUp');
  await expect(phrase).toContainText("It's two minutes past eight in the morning");
});
