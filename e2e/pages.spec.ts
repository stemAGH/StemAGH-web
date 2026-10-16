import { expect, test, type Page } from '@playwright/test';

const REPO = 'https://github.com/stemAGH/openestate';

async function nav(page: Page, isMobile: boolean) {
  if (isMobile) await page.locator('button[aria-controls="mobile-nav"]').click();
  return page.getByRole('navigation', { name: 'Primary' }).or(page.locator('#mobile-nav'));
}

test('About renders its heading, title and sections', async ({ page }) => {
  await page.goto('/about');
  await expect(page).toHaveTitle('About | StemAGH');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('software brand');
  for (const name of ['One brand, many products', 'What exists today', 'The portfolio may grow']) {
    await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
  }
  await expect(page.getByRole('article')).toHaveCount(1); // OpenEstate card from shared data
  await expect(page.getByText(/Established in OpenEstate/).first()).toBeVisible();
});

test('About links to the product, the portfolio and the repository', async ({ page }) => {
  await page.goto('/about');
  const main = page.getByRole('main');
  await expect(main.getByRole('link', { name: 'Explore products' })).toHaveAttribute(
    'href',
    '/products',
  );
  await expect(main.getByRole('link', { name: 'Discover OpenEstate' })).toHaveAttribute(
    'href',
    '/products/openestate',
  );
  await expect(main.getByRole('link', { name: /OpenEstate source on GitHub/ })).toHaveAttribute(
    'href',
    REPO,
  );
});

test('Contact renders, shows the owner-provided email, and lists verified channels', async ({
  page,
}) => {
  await page.goto('/contact');
  await expect(page).toHaveTitle('Contact | StemAGH');
  await expect(page.getByRole('heading', { level: 1, name: 'Get in touch' })).toBeVisible();
  await expect(page.getByText('has not published a general enquiry address')).toHaveCount(0);
  const mail = page.locator('a[href^="mailto:"]');
  await expect(mail).toHaveCount(1);
  await expect(mail).toHaveAttribute('href', 'mailto:contact@stemagh.com');
  await expect(mail).toHaveText('contact@stemagh.com');

  const href = async (name: string | RegExp) =>
    page.getByRole('link', { name }).first().getAttribute('href');
  expect(await href('Open an issue')).toBe(`${REPO}/issues/new/choose`);
  expect(await href('Browse existing issues')).toBe(`${REPO}/issues`);
  expect(await href('Contribution guide')).toBe(`${REPO}/blob/master/CONTRIBUTING.md`);
  expect(await href('Read the security policy')).toBe(`${REPO}/blob/master/SECURITY.md`);
  // Vulnerabilities go to private advisories, never the public tracker.
  expect(await href('Report a vulnerability privately')).toBe(`${REPO}/security/advisories/new`);
  await expect(page.getByText('Do not open a public issue')).toBeVisible();
});

test('Contact has no form', async ({ page }) => {
  await page.goto('/contact');
  expect(await page.locator('form, input, textarea').count()).toBe(0);
});

test('navigate between pages with the shared nav, active state follows', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  for (const [label, url] of [
    ['About', /\/about$/],
    ['Contact', /\/contact$/],
    ['Products', /\/products$/],
  ] as const) {
    const n = await nav(page, isMobile);
    await n.getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(url);
    const n2 = await nav(page, isMobile);
    await expect(n2.getByRole('link', { name: label, exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );
    for (const other of ['About', 'Contact']) {
      if (other !== label) {
        await expect(n2.getByRole('link', { name: other, exact: true })).not.toHaveAttribute(
          'aria-current',
        );
      }
    }
    if (isMobile) await page.keyboard.press('Escape');
  }
});

test('header and footer are the same shared markup on About and Contact', async ({ page }) => {
  for (const path of ['/about', '/contact']) {
    await page.goto(path);
    await expect(page.getByRole('banner')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
    await expect(
      page.getByRole('contentinfo').getByRole('link', { name: 'Contact', exact: true }),
    ).toHaveAttribute('href', '/contact');
  }
});

test('mobile menu on About lists all four links and Escape restores focus', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'mobile only');
  await page.goto('/about');
  const button = page.locator('button[aria-controls="mobile-nav"]');
  await button.click();
  const menu = page.locator('#mobile-nav');
  for (const l of ['Products', 'OpenEstate', 'About', 'Contact']) {
    await expect(menu.getByRole('link', { name: l, exact: true })).toBeVisible();
  }
  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(button).toBeFocused();
});

test('nav fits on one row at tablet width', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop project only');
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto('/');
  const box = await page.getByRole('banner').boundingBox();
  expect(box!.height).toBeLessThanOrEqual(65);
});
