import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('services, showcase, hosting terms and enquiry journey work', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Built around');
  if ((page.viewportSize()?.width ?? 1200) < 768)
    await page.getByRole('button', { name: 'Menu navigation' }).click();
  await page.getByRole('link', { name: 'Services', exact: true }).first().click();
  await expect(page).toHaveURL(/#services$/);
  await expect(page.getByRole('heading', { name: 'Websites that mean business.' })).toBeVisible();
  await page.getByRole('button', { name: 'Dues dashboard', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Dues Dashboard', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reports', exact: true }).click();
  await expect(page.getByText('Illustrative report visualization')).toBeVisible();
  await page.locator('summary').filter({ hasText: 'Is hosting free?' }).click();
  await expect(page.getByText('The hosting plan itself depends', { exact: false })).toBeVisible();
  await page.evaluate(async () => {
    await Promise.all(
      document.getAnimations().map((animation) => animation.finished.catch(() => {})),
    );
  });
  const issues = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(
    issues.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(',')}`),
  ).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page
    .getByRole('link', { name: /^Discuss your project/ })
    .last()
    .click();
  await expect(page).toHaveURL(/\/contact#project-brief$/);
  await expect(page.getByRole('link', { name: 'contact@stemagh.com' })).toHaveAttribute(
    'href',
    'mailto:contact@stemagh.com',
  );
});

test('scroll progress and surrounding content remain accessible without video', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('video')).toHaveCount(0);
  await page.getByRole('link', { name: 'Explore OpenEstate ↓', exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await page.locator('.studio-cta').scrollIntoViewIfNeeded();
  await expect(page.locator('.studio-cta h2')).not.toHaveClass(/reveal-pending/);
  await expect
    .poll(() => page.locator('.reading-progress').evaluate((el) => getComputedStyle(el).transform))
    .not.toBe('matrix(0, 0, 0, 1, 0, 0)');
});

test('reduced motion preserves readable content and the project email brief', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.reveal-pending')).toHaveCount(0);
  await page.goto('/contact#project-brief');
  await page.getByLabel('Your name', { exact: true }).fill('Preview visitor');
  await page.getByLabel('Email address', { exact: true }).fill('visitor@example.org');
  await page
    .getByLabel('What would you like to achieve?')
    .fill('Build a website for our consulting business.');
  await page.getByRole('button', { name: 'Prepare project email' }).click();
  await expect(page.getByRole('status')).toContainText('Nothing has been sent yet.');
  const draft = page.getByRole('link', { name: 'Open email draft' });
  await expect(draft).toHaveAttribute('href', /^mailto:contact@stemagh.com/);
  expect(decodeURIComponent((await draft.getAttribute('href'))!)).toContain(
    'Build a website for our consulting business.',
  );
});
