import { expect, test } from '@playwright/test';
import { buyerGuides } from '../src/content/buyer-guides';

for (const guide of buyerGuides) {
  test(`buyers can find and use ${guide.slug}`, async ({ page, request }) => {
    await page.goto('/insights');
    await page.getByRole('link', { name: guide.title, exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(guide.title);
    for (const [heading] of guide.sections) {
      await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    }
    for (const [href, label] of guide.links) {
      await expect(page.getByRole('link', { name: label, exact: true })).toHaveAttribute(
        'href',
        href,
      );
      expect((await request.get(href)).ok()).toBe(true);
    }
    for (const img of await page.locator('article figure img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() => img.evaluate((node) => (node as HTMLImageElement).naturalWidth))
        .toBeGreaterThan(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}
