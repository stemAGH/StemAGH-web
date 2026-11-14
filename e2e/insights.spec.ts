import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { outagePost } from '../src/content/outage-post';
const path = `/insights/${outagePost.slug}`;

test('post attributes the dated source and qualifies availability claims', async ({ page }) => {
  await page.goto(path);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(outagePost.title);
  await expect(page.getByText(/NDTV reported on November 13, 2026/)).toBeVisible();
  await expect(page.getByRole('link', { name: /Read NDTV/ })).toHaveAttribute(
    'href',
    outagePost.source,
  );
  await expect(page.getByText(/not a live Microsoft service-status update/)).toBeVisible();
  await expect(page.getByText(/It does not replace Outlook, Teams or Microsoft 365/)).toBeVisible();
  await expect(
    page.getByText(/Does self-hosting guarantee 365 days without interruption\? No\./),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Installation guide' })).toHaveAttribute(
    'href',
    '/products/openestate/install',
  );
  const schemas = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(
    (s) => JSON.parse(s),
  );
  const article = schemas.find((s) => s['@type'] === 'BlogPosting');
  expect(article.citation).toBe(outagePost.source);
  expect(article.datePublished).toBe('2026-11-14');
});

test('post is discoverable from the homepage and insight index', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Read the post' }).click();
  await expect(page).toHaveURL(new RegExp(`${outagePost.slug}$`));
  await page.getByRole('link', { name: 'All insights' }).click();
  await expect(page).toHaveURL(/\/insights$/);
  await page.getByRole('link', { name: 'Read the post' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(outagePost.title);
});

test('article is accessible and fits desktop and mobile', async ({ page }) => {
  await page.goto(path);
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(
    result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(',')}`),
  ).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
