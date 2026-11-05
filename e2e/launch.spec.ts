import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/work',
  '/products',
  '/products/openestate',
  '/products/openestate/install',
  '/about',
  '/contact',
  '/privacy',
];

for (const route of routes) {
  test(`${route}: no cookies and no third-party requests`, async ({ page, context }) => {
    const hosts = new Set<string>();
    page.on('request', (r) => {
      const u = new URL(r.url());
      if (u.protocol.startsWith('http')) hosts.add(u.host);
    });
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    expect([...hosts]).toEqual([new URL(page.url()).host]);
    expect(await context.cookies()).toEqual([]);
  });

  test(`${route}: logo in header, enquiry email and privacy link in footer`, async ({ page }) => {
    await page.goto(route);
    const home = page.getByRole('banner').getByRole('link', { name: 'StemAGH home' });
    await expect(home.locator('img')).toHaveCount(1);
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('link', { name: 'contact@stemagh.com' })).toHaveAttribute(
      'href',
      'mailto:contact@stemagh.com',
    );
    await expect(footer.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
  });
}

test('icons and social card exist; domain-dependent metadata is off without SITE_URL', async ({
  page,
  request,
}) => {
  await page.goto('/');
  const withUrl = !!process.env.SITE_URL;
  expect(await page.locator('meta[property="og:image"]').count()).toBe(withUrl ? 1 : 0);
  expect(await page.locator('link[rel="canonical"]').count()).toBe(withUrl ? 1 : 0);
  const icons = await page
    .locator('link[rel~="icon"], link[rel="apple-touch-icon"]')
    .evaluateAll((els) => els.map((e) => (e as HTMLLinkElement).href));
  expect(icons.length).toBeGreaterThanOrEqual(2);
  for (const href of icons) expect((await request.get(href)).status(), href).toBe(200);
  const og = await request.get('/og.png');
  expect(og.status()).toBe(200);
  expect(og.headers()['content-type']).toBe('image/png');
});

test('robots allows crawling and the sitemap lists no guessed URLs', async ({ request }) => {
  test.skip(!!process.env.SITE_URL, 'covered by production-seo.spec.ts');
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Allow: /');
  expect(robots).toContain('Disallow: /api/');
  expect(robots).not.toContain('Sitemap:');
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).not.toContain('<loc>');
});

test('product page shows when it was last checked', async ({ page }) => {
  await page.goto('/products/openestate');
  // The search title carries the words people type, not just the product name.
  await expect(page).toHaveTitle('OpenEstate: Open-Source Real Estate CRM | StemAGH');
  await expect(
    page.getByText(/Last checked against the OpenEstate repository on \d+ \w+ \d{4}/),
  ).toBeVisible();
});

test('404 page is noindex, titled, and carries no canonical or placeholder URL', async ({
  page,
}) => {
  const res = await page.goto('/products/not-a-product');
  expect(res?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found | StemAGH');
  expect(await page.locator('meta[name="robots"]').getAttribute('content')).toContain('noindex');
  expect(await page.locator('link[rel="canonical"]').count()).toBe(0);
});
