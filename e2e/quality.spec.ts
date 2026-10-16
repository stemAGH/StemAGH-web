import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = ['/', '/products', '/products/openestate', '/about', '/contact'];

for (const route of routes) {
  test.describe(route, () => {
    test('heading hierarchy has one h1 and no skipped levels', async ({ page }) => {
      await page.goto(route);
      const levels = await page.$$eval('h1,h2,h3,h4,h5,h6', (els) =>
        els.map((e) => Number(e.tagName[1])),
      );
      expect(levels.filter((l) => l === 1)).toHaveLength(1);
      expect(levels[0]).toBe(1);
      levels
        .slice(1)
        .forEach((l, i) => expect(l - levels[i]!, `at heading ${i + 1}`).toBeLessThanOrEqual(1));
    });

    test('every interactive element is reachable by keyboard and shows a focus ring', async ({
      page,
    }) => {
      await page.goto(route);
      const visible = await page
        .locator('a[href], button, [tabindex="0"]')
        .evaluateAll(
          (els) =>
            els.filter((e) => (e as HTMLElement).offsetParent !== null || e.closest('header'))
              .length,
        );
      const seen = new Set<string>();
      for (let i = 0; i < visible + 3; i++) {
        await page.keyboard.press('Tab');
        const info = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return {
            id: `${el.tagName}|${el.getAttribute('href') ?? ''}|${el.textContent?.trim().slice(0, 30)}|${Math.round(r.x)},${Math.round(r.y)}`,
            outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2,
          };
        });
        if (!info) continue;
        expect(info.outline, `no focus ring on ${info.id}`).toBe(true);
        seen.add(info.id);
      }
      expect(seen.size).toBeGreaterThan(5);
    });

    test('axe including best-practice rules finds nothing', async ({ page }) => {
      await page.goto(route);
      const r = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze();
      expect(
        r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`),
      ).toEqual([]);
    });

    test('has title, description, Open Graph, icon and a canonical only when SITE_URL is set', async ({
      page,
      request,
    }) => {
      await page.goto(route);
      expect((await page.title()).length).toBeGreaterThan(5);
      for (const sel of [
        'meta[name="description"]',
        'meta[property="og:title"]',
        'meta[property="og:description"]',
      ]) {
        expect(await page.locator(sel).getAttribute('content'), sel).toBeTruthy();
      }
      // Off without SITE_URL; with it, production-seo.spec.ts asserts the exact value.
      expect(await page.locator('link[rel="canonical"]').count()).toBe(
        process.env.SITE_URL ? 1 : 0,
      );
      const href = await page.locator('link[rel~="icon"]').first().getAttribute('href');
      expect(href).toBeTruthy();
      const res = await request.get(href!);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toContain('svg');
    });
  });
}

test('reduced motion removes transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/products');
  const duration = await page
    .locator('article')
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration));
  expect(duration).toBeLessThan(0.001);
});

test('structured data is limited to verifiable facts', async ({ page }) => {
  await page.goto('/products/openestate');
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const data = JSON.parse(raw!);
  expect(data['@type']).toBe('SoftwareApplication');
  expect(data.name).toBe('OpenEstate');
  for (const banned of ['offers', 'aggregateRating', 'review', 'url']) {
    expect(data, banned).not.toHaveProperty(banned);
  }
});

test('the icon request does not 404 (no stray /favicon.ico dependency)', async ({ page }) => {
  const failed: string[] = [];
  page.on('response', (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(failed).toEqual([]);
});
