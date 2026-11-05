import { expect, test } from '@playwright/test';

const PATH = '/products/openestate/install';

test('install page has a search title, the installer command and honest platform wording', async ({
  page,
}) => {
  await page.goto(PATH);
  await expect(page).toHaveTitle('Install OpenEstate on Ubuntu: Step-by-Step Guide | StemAGH');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Install OpenEstate on your own server' }),
  ).toBeVisible();
  await expect(page.getByLabel('Installer commands')).toContainText('sudo ./install-native.sh');
  await expect(page.getByLabel('Prerequisite commands')).toContainText('setup_20.x');
  await expect(page.getByText(/Ubuntu 25\.10 with PostgreSQL 17/)).toBeVisible();
  await expect(page.getByText(/have not been\s+independently re-verified/)).toBeVisible();
  // No credentials: the one-time password is generated on the server.
  expect(await page.content()).not.toMatch(/Admin@123/);
});

test('install page is reachable from the product page and listed as HowTo data', async ({
  page,
}) => {
  await page.goto('/products/openestate');
  await expect(
    page.getByRole('main').getByRole('link', { name: 'Read the installation guide' }),
  ).toHaveAttribute('href', PATH);
  await page.goto(PATH);
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(schemas.map((s) => JSON.parse(s)['@type'])).toContain('HowTo');
});

test('install page enquiry form labels where it came from', async ({ page }) => {
  await page.goto(PATH);
  await expect(page.locator('input[name="source"]')).toHaveValue('Install page');
});
