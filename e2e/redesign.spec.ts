import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home is compact: hero, services, work, process, call to action', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Software built around');
  const h2 = await page.getByRole('main').locator('h2').allInnerTexts();
  expect(h2).toEqual(['What we build', 'Our work', 'How we work', 'Have a project in mind?']);
  // Detail lives on its own pages, not on home.
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.getByText('Is hosting free?')).toHaveCount(0);
  const issues = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(
    issues.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(',')}`),
  ).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('home links lead to the demo, the product and the brief', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try a live demo' }).click();
  await expect(page).toHaveURL(/\/work$/);
  await page.goto('/');
  await page.getByRole('link', { name: /Explore the product/ }).click();
  await expect(page).toHaveURL(/\/products\/openestate$/);
  await expect(page.getByRole('heading', { name: 'A look inside' })).toBeVisible();
  await page.getByRole('button', { name: 'Dues dashboard', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Dues Dashboard', exact: true })).toBeVisible();
  await page.goto('/');
  await page.getByRole('link', { name: /Let’s talk about web & mobile apps/ }).click();
  await expect(page).toHaveURL(/\/contact\?service=app#project-brief$/);
  await expect(page.getByLabel('What do you need?')).toHaveValue('Mobile app');
});

test('services page carries the hosting terms and FAQ', async ({ page }) => {
  await page.goto('/services');
  await expect(page.getByRole('heading', { name: /Built for you/ })).toBeVisible();
  await page.locator('summary').filter({ hasText: 'Is hosting free?' }).click();
  await expect(page.getByText('The hosting plan itself depends', { exact: false })).toBeVisible();
});

test('when mail cannot be sent, the brief falls back to an email draft', async ({ page }) => {
  await page.goto('/contact#project-brief');
  await page.getByLabel('Your name', { exact: true }).fill('Preview visitor');
  await page.getByLabel('Email address', { exact: true }).fill('visitor@example.org');
  await page
    .getByLabel('What would you like to achieve?')
    .fill('Build a website for our consulting business.');
  await page.getByRole('button', { name: /Send project brief/ }).click();
  await expect(page.locator('#project-brief').getByRole('alert')).toContainText(
    'nothing has been lost',
  );
  const draft = page.getByRole('link', { name: 'Open email draft' });
  await expect(draft).toHaveAttribute('href', /^mailto:contact@stemagh.com/);
  expect(decodeURIComponent((await draft.getAttribute('href'))!)).toContain(
    'Build a website for our consulting business.',
  );
});
