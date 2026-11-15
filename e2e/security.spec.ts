import { expect, test } from '@playwright/test';

test('REQ-SEC-001/004: ships a strict CSP and no-referrer policy', async ({ page }) => {
  await page.goto('./');
  const csp = await page
    .locator('meta[http-equiv="Content-Security-Policy"]')
    .getAttribute('content');
  expect(csp).toContain("default-src 'none'");
  expect(csp).toContain("script-src 'self'");
  expect(csp).toContain("style-src 'self'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("base-uri 'none'");
  expect(csp).toContain("form-action 'none'");
  expect(csp).not.toContain('unsafe-inline');
  expect(csp).not.toContain('unsafe-eval');
  await expect(page.locator('meta[name="referrer"]')).toHaveAttribute('content', 'no-referrer');
});

test('REQ-SEC-001/002/003: runs without CSP violations, inline code or third parties', async ({
  page,
  baseURL,
}) => {
  const problems: string[] = [];
  const origins = new Set<string>();
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(msg.text());
  });
  page.on('pageerror', (err) => problems.push(err.message));
  page.on('request', (req) => origins.add(new URL(req.url()).origin));

  await page.goto('./');
  await page.getByRole('button', { name: 'Hours' }).click();
  await page.getByRole('button', { name: 'Pause' }).click();
  await page.getByRole('button', { name: 'Night' }).click();
  await expect(page.getByTestId('time-phrase')).toContainText("It's");

  expect(problems).toEqual([]);
  expect([...origins]).toEqual([new URL(baseURL ?? '').origin]);
  await expect(page.locator('script:not([src])')).toHaveCount(0);
  await expect(page.locator('[style]')).toHaveCount(0);

  const stored = await page.evaluate(() => ({
    cookies: document.cookie,
    local: localStorage.length,
    session: sessionStorage.length,
  }));
  expect(stored).toEqual({ cookies: '', local: 0, session: 0 });
});
