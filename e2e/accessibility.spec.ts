import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const colorScheme of ['light', 'dark'] as const) {
  test(`REQ-QA-003: no accessibility violations in ${colorScheme} mode`, async ({ page }) => {
    // Reduced motion removes colour transitions so axe measures the final colours.
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
    await page.clock.install({ time: new Date(2026, 0, 15, 15, 25, 42) });
    await page.goto('./');

    const running = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(running.violations).toEqual([]);

    await page.getByRole('button', { name: 'Pause' }).click();
    await page.getByRole('button', { name: 'Night' }).click();
    const paused = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(paused.violations).toEqual([]);
  });
}
