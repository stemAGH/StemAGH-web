import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('pitch page greets the recipient and names their company', async ({ page }) => {
  await page.goto('/hello?name=Ravi&company=Acme%20Realty');
  await expect(page.getByText('Prepared for Acme Realty')).toBeVisible();
  await expect(page.getByText('Hi Ravi,')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Here’s what we could build for Acme Realty.',
  );
  await expect(page.getByRole('heading', { name: 'Where we can help Acme Realty' })).toBeVisible();
  // Outbound-only and personalised: never indexed.
  expect(await page.locator('meta[name="robots"]').getAttribute('content')).toContain('noindex');
  const issues = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(issues.violations.map((v) => v.id)).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('pitch page without parameters reads naturally', async ({ page }) => {
  await page.goto('/hello');
  await expect(page.getByText('A two-minute introduction')).toBeVisible();
  await expect(page.getByText(/^Hi /)).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Here’s what we could build for your business.',
  );
});

test('link text is cleaned and shortened, never rendered as markup', async ({ page }) => {
  await page.goto(`/hello?company=${encodeURIComponent('<b>Evil</b>' + 'x'.repeat(100))}`);
  const h1 = await page.getByRole('heading', { level: 1 }).textContent();
  expect(h1).not.toContain('<');
  expect(h1).toContain('bEvil/b');
  await expect(page.locator('h1 b')).toHaveCount(0);
  // 60-character limit on the company name.
  expect(h1!.length).toBeLessThan('Here’s what we could build for .'.length + 61);
});

test('pitch page demo works and the brief arrives labelled with the company', async ({ page }) => {
  await page.goto('/hello?name=Ravi&company=Acme%20Realty');
  await expect(
    page.frameLocator('iframe[title^="Aurelia Estates"]').getByText('Your world.'),
  ).toBeVisible();
  let sent: Record<string, unknown> | undefined;
  await page.route('**/api/contact', (r) => {
    sent = r.request().postDataJSON();
    return r.fulfill({ json: { ok: true } });
  });
  const form = page.locator('#project-brief form');
  await expect(form.getByLabel(/Company/)).toHaveValue('Acme Realty');
  await form.getByLabel('Your name', { exact: true }).fill('Ravi Kumar');
  await form.getByLabel('Email address', { exact: true }).fill('ravi@example.org');
  await form.getByLabel('What would you like to achieve?').fill('A customer app for our buyers.');
  await form.getByRole('button', { name: /Send project brief/ }).click();
  await expect(page.getByRole('status')).toContainText('Thanks, Ravi.');
  expect(sent).toMatchObject({ company: 'Acme Realty', source: 'Pitch page (Acme Realty)' });
});

test('pitch page is not in the sitemap', async ({ request }) => {
  expect(await (await request.get('/sitemap.xml')).text()).not.toContain('/hello');
});
