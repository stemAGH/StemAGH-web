import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const routes = ['/', '/products', '/products/openestate', '/about', '/contact'];

async function openNav(page: Page, isMobile: boolean) {
  if (isMobile) await page.locator('button[aria-controls="mobile-nav"]').click();
  return page.getByRole('navigation', { name: 'Primary' }).or(page.locator('#mobile-nav'));
}

test('homepage shows hero, featured product and shared navigation', async ({ page, isMobile }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/StemAGH/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Dependable software');
  await expect(
    page.getByRole('heading', { level: 2, name: /OpenEstate: an open-source CRM/ }),
  ).toBeVisible();

  const nav = await openNav(page, isMobile);
  await expect(nav.getByRole('link', { name: 'Products', exact: true })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'OpenEstate', exact: true })).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
});

test('product data is shared: homepage card, portfolio and detail agree', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('main')
    .getByRole('link', { name: 'OpenEstate', exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/products\/openestate$/);
  await expect(page.getByRole('heading', { level: 1, name: 'OpenEstate' })).toBeVisible();

  await page.goto('/products');
  await expect(page.getByRole('heading', { level: 1, name: 'Products' })).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByText('AGPL-3.0').first()).toBeVisible();
});

test('active navigation link is marked', async ({ page, isMobile }) => {
  await page.goto('/products/openestate');
  const nav = await openNav(page, isMobile);
  await expect(nav.getByRole('link', { name: 'OpenEstate', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(nav.getByRole('link', { name: 'Products', exact: true })).not.toHaveAttribute(
    'aria-current',
  );
});

test('mobile menu closes on Escape and returns focus', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  await page.goto('/');
  const button = page.locator('button[aria-controls="mobile-nav"]');
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(button).toBeFocused();
});

test('OpenEstate page states licence, links and known gaps', async ({ page }) => {
  await page.goto('/products/openestate');
  await expect(page.getByRole('heading', { name: 'Known gaps, stated plainly' })).toBeVisible();
  await expect(page.getByText('There is no hosted demo yet')).toBeVisible();
  const repo = page.getByRole('link', { name: /View on GitHub/ }).first();
  await expect(repo).toHaveAttribute('href', 'https://github.com/stemAGH/openestate');
  await expect(repo).toHaveAttribute('rel', /noopener/);
});

test('unknown routes and product slugs return 404', async ({ page }) => {
  for (const path of ['/does-not-exist', '/products/not-a-product']) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(404);
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  }
});

for (const route of routes) {
  test(`no horizontal overflow on ${route}`, async ({ page }) => {
    await page.goto(route);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test(`axe finds no violations on ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`),
    ).toEqual([]);
  });
}
