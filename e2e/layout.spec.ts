import { expect, test, type Page } from '@playwright/test';

const VIEWPORTS = [
  { name: 'small phone', width: 320, height: 480 },
  { name: 'compact phone', width: 360, height: 640 },
  { name: 'phone', width: 390, height: 844 },
  { name: 'tall phone', width: 412, height: 915 },
  { name: 'phone landscape', width: 740, height: 360 },
  { name: 'large phone landscape', width: 915, height: 412 },
  { name: 'small phone landscape', width: 568, height: 320 },
  { name: 'tablet portrait', width: 768, height: 1024 },
  { name: 'tablet landscape', width: 1024, height: 768 },
  { name: 'laptop', width: 1280, height: 720 },
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'wide desktop', width: 2560, height: 1440 },
];

async function expectFullyVisible(page: Page, selector: string) {
  const viewport = page.viewportSize();
  if (!viewport) throw new Error('No viewport');
  for (const box of await page
    .locator(selector)
    .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().toJSON()))) {
    expect(box.left, selector).toBeGreaterThanOrEqual(-0.5);
    expect(box.top, selector).toBeGreaterThanOrEqual(-0.5);
    expect(box.right, selector).toBeLessThanOrEqual(viewport.width + 0.5);
    expect(box.bottom, selector).toBeLessThanOrEqual(viewport.height + 0.5);
  }
}

for (const vp of VIEWPORTS) {
  test(`REQ-FACE-006: everything fits without scrolling — ${vp.name} ${vp.width}×${vp.height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.clock.install({ time: new Date(2026, 0, 15, 12, 29, 0) });
    await page.goto('./');

    const scroll = await page.evaluate(() => ({
      x: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      y: document.documentElement.scrollHeight - document.documentElement.clientHeight,
    }));
    expect(scroll).toEqual({ x: 0, y: 0 });

    await expectFullyVisible(page, 'h1');
    await expectFullyVisible(page, '[role="slider"]');
    await expectFullyVisible(page, '[data-testid="time-phrase"]');
    await expectFullyVisible(page, 'button');

    const dial = await page.getByRole('slider', { name: /Analog clock/ }).boundingBox();
    expect(dial?.width).toBeGreaterThanOrEqual(150);
  });
}

test('REQ-FACE-010: the dial does not move when the phrase changes length', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.clock.install({ time: new Date(2026, 0, 15, 12, 0, 0) });
  await page.goto('./');
  await page.getByRole('button', { name: 'Pause' }).click();

  const dial = page.getByRole('slider', { name: /Analog clock/ });
  const phrase = page.getByTestId('time-phrase');
  await expect(phrase).toContainText("It's noon");
  const before = await dial.boundingBox();

  await dial.focus();
  for (let i = 0; i < 29; i++) await page.keyboard.press('ArrowRight');
  await expect(phrase).toContainText("It's twenty-nine minutes past twelve in the afternoon");
  expect(await dial.boundingBox()).toEqual(before);

  await page.getByRole('button', { name: 'Play' }).click();
  expect(await dial.boundingBox()).toEqual(before);
});
