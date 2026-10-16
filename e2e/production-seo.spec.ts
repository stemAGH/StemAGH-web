import { expect, test } from '@playwright/test';

// Runs only against a build made with SITE_URL set:
//   SITE_URL=https://www.stemagh.com pnpm test:e2e
const SITE = process.env.SITE_URL;
test.skip(!SITE, 'set SITE_URL to verify production metadata');

const pages = [
  ['/', SITE],
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

test('sitemap lists exactly the five public pages, robots points at it', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(locs).toEqual(pages.map(([, url]) => url));
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);
  expect(robots).toContain('Allow: /');
});
