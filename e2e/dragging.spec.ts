import { expect, test, type Page } from '@playwright/test';

/** Screen point at `angle` degrees clockwise from 12, `factor` of the dial radius out. */
async function dialPoint(page: Page, angle: number, factor = 0.6) {
  const box = await page.getByRole('slider', { name: /Analog clock/ }).boundingBox();
  if (!box) throw new Error('Dial not visible');
  const r = (Math.min(box.width, box.height) / 2) * factor;
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

/** Drags around the dial through the given angles (degrees clockwise from 12). */
async function drag(page: Page, from: number, to: number, stepDeg = 10) {
  const start = await dialPoint(page, from);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  const dir = Math.sign(to - from);
  for (let a = from + dir * stepDeg; dir * (to - a) >= 0; a += dir * stepDeg) {
    const p = await dialPoint(page, a);
    await page.mouse.move(p.x, p.y);
  }
  await page.mouse.up();
}

async function setUp(page: Page, h: number, m: number, s = 0, pause = true) {
  await page.clock.install({ time: new Date(2026, 0, 15, h, m, s) });
  await page.goto('./');
  if (pause) await page.getByRole('button', { name: 'Pause' }).click();
}

const phrase = (page: Page) => page.getByTestId('time-phrase');

test('REQ-DRAG-002: pressing without moving does not move any hand', async ({ page }) => {
  await setUp(page, 15, 0);
  const before = await phrase(page).textContent();
  const p = await dialPoint(page, 135);
  await page.mouse.move(p.x, p.y);
  await page.mouse.down();
  await page.mouse.up();
  await expect(phrase(page)).toHaveText(before ?? '');
  await expectAngle(page, 'minutes', 0, 0.1);
});

test('REQ-DRAG-003: a quarter turn of the minute hand drags the hour hand', async ({ page }) => {
  await setUp(page, 15, 0);
  await drag(page, 200, 290);
  await expect(phrase(page)).toContainText("It's a quarter past three in the afternoon");
  await expectAngle(page, 'minutes', 90, 0.1);
  await expectAngle(page, 'hours', 97.5, 0.1);
});

test('REQ-DRAG-003: dragging the minute hand past 12 advances the hour', async ({ page }) => {
  await setUp(page, 15, 50);
  await drag(page, 300, 420);
  await expect(phrase(page)).toContainText("It's ten past four in the afternoon");
});

test('REQ-DRAG-003/REQ-TIME-010: the hour hand keeps the seconds still', async ({ page }) => {
  await setUp(page, 15, 0, 42);
  await page.getByRole('button', { name: 'Hours' }).click();
  await drag(page, 0, 90);
  await expectAngle(page, 'hours', 180, 1);
  expect(await rotation(page, 'seconds')).toBe(252);
  await expect(phrase(page)).toContainText('and forty-two seconds');
});

test('REQ-DRAG-003: the seconds hand drags minutes back', async ({ page }) => {
  await setUp(page, 15, 0);
  await page.getByRole('button', { name: 'Seconds' }).click();
  await drag(page, 90, 0);
  await expectAngle(page, 'seconds', 270, 6);
  await expect(phrase(page)).toContainText("It's one minute to three in the afternoon");
});

test('REQ-DRAG-009: dragging through the centre does not jump', async ({ page }) => {
  await setUp(page, 15, 0);
  const a = await dialPoint(page, 90, 0.8);
  const b = await dialPoint(page, 270, 0.8);
  await page.mouse.move(a.x, a.y);
  await page.mouse.down();
  await page.mouse.move(b.x, b.y, { steps: 25 });
  await page.mouse.up();
  await expectAngle(page, 'minutes', 0, 1);
  await expect(phrase(page)).toContainText("It's three o'clock in the afternoon");
});

test('REQ-DRAG-004: the clock holds still while dragging and resumes after', async ({ page }) => {
  await setUp(page, 15, 0, 0, false);
  const p = await dialPoint(page, 90);
  await page.mouse.move(p.x, p.y);
  await page.mouse.down();
  const held = await phrase(page).textContent();
  await page.clock.runFor(2000);
  await expect(phrase(page)).toHaveText(held ?? '');
  await page.mouse.up();
  await page.clock.runFor(2000);
  await expect(phrase(page)).not.toHaveText(held ?? '');
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
  await touch('touchStart', 180);
  for (let angle = 190; angle <= 270; angle += 10) await touch('touchMove', angle);
  await touch('touchEnd');

  await expect(phrase(page)).toContainText("It's a quarter past three in the afternoon");
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test('REQ-DRAG-007: arrow keys step the selected hand', async ({ page }) => {
  await setUp(page, 15, 0);
  const dial = page.getByRole('slider', { name: /Analog clock/ });
  await dial.focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(phrase(page)).toContainText("It's two minutes past three in the afternoon");
  await expect(dial).toHaveAttribute('aria-valuetext', /^It's two minutes past three/);

  await page.getByRole('button', { name: 'Hours' }).click();
  await dial.focus();
  await page.keyboard.press('PageUp');
  await expect(phrase(page)).toContainText("It's two minutes past eight in the morning");
});
