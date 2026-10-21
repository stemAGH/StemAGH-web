import { expect, test } from '@playwright/test';

// Runs only against a build made with SITE_URL set:
//   SITE_URL=https://www.stemagh.com pnpm test:e2e
const SITE = process.env.SITE_URL;
test.skip(!SITE, 'set SITE_URL to verify production metadata');

const pages = [
  ['/', SITE],
  ['/services', `${SITE}/services`],
  ['/products', `${SITE}/products`],
  ['/products/openestate', `${SITE}/products/openestate`],
  ['/about', `${SITE}/about`],
  ['/contact', `${SITE}/contact`],
] as const;

for (const [path, url] of pages) {
  test(`${path}: canonical, og:url, og:image, twitter card use ${SITE}`, async ({ page }) => {
    await page.goto(path);
    const attr = (sel: string, a: string) => page.locator(sel).first().getAttribute(a);
    expect(await attr('link[rel="canonical"]', 'href')).toBe(url);
    expect(await attr('meta[property="og:url"]', 'content')).toBe(url);
    expect(await attr('meta[property="og:image"]', 'content')).toBe(`${SITE}/og.png`);
    expect(await attr('meta[name="twitter:card"]', 'content')).toBe('summary_large_image');
    expect(await attr('meta[name="twitter:image"]', 'content')).toBe(`${SITE}/og.png`);
    expect(await attr('link[rel="apple-touch-icon"]', 'href')).toContain('/apple-icon.png');
    const html = await page.content();
    expect(html).not.toMatch(/localhost|example\.(com|test)|vercel\.app/i);
  });
}

test('sitemap lists all six public pages, robots points at it', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(locs).toEqual(pages.map(([, url]) => url));
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);
  expect(robots).toContain('Allow: /');
});

test('service facts, organization identity and AI summary agree', async ({ request }) => {
  const response = await request.get('/services');
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain('Website development and custom software for your business.');
  const scripts = [
    ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
  ].map((match) => JSON.parse(match[1]!));
  const organization = scripts.find((item) => item['@type'] === 'Organization');
  expect(organization['@id']).toBe(`${SITE}/#organization`);
  expect(organization.email).toBe('contact@stemagh.com');
  const list = scripts.find((item) => item['@type'] === 'ItemList');
  expect(list.itemListElement).toHaveLength(3);
  expect(list.itemListElement[0].item.provider['@id']).toBe(organization['@id']);
  const summary = await request.get('/llms.txt');
  expect(summary.headers()['content-type']).toContain('text/plain');
  const text = await summary.text();
  expect(text).toContain(`${SITE}/services`);
  expect(text).toContain(
    'Hosting subscriptions, domains, email and maintenance are quoted separately.',
  );
});

test('homepage primary content is available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://localhost:3100/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Built around');
  await expect(page.getByRole('heading', { name: 'Websites that mean business.' })).toBeVisible();
  await expect(page.getByRole('link', { name: /View service deliverables/ })).toHaveAttribute(
    'href',
    '/services',
  );
  await context.close();
});
