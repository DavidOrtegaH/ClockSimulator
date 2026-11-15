import { expect, test } from '@playwright/test';

test('the app loads with an English title', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle('Clock Simulator');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
