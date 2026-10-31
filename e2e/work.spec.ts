import { expect, test } from '@playwright/test';

test('work page demo is a real app the visitor can drive', async ({ page, isMobile }) => {
  await page.goto('/work');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Real software.');
  const app = page.frameLocator('iframe[title^="Aurelia Estates"]');
  await expect(app.getByText('Your world.')).toBeVisible();
  // Tap inside the app itself, as a visitor would.
  await app.getByRole('navigation', { name: 'Main navigation' }).getByText('Projects').click();
  await expect(app.locator('#view')).toContainText('Find your');
  if (!isMobile) {
    // The side panel drives the same app.
    await page.getByRole('button', { name: /^Support/ }).click();
    await expect(page.getByRole('button', { name: /^Support/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(app.locator('#view')).toContainText('A little help.');
  }
  await page.getByRole('button', { name: 'Reset demo data' }).click();
  await expect(app.getByText('Your world.')).toBeVisible();
});

test('demo assets are optimised and self-contained', async ({ request }) => {
  const img = await request.get('/demos/aurelia/images/willow-creek.webp');
  expect(img.status()).toBe(200);
  expect((await img.body()).byteLength).toBeLessThan(400_000);
  const css = await (await request.get('/demos/aurelia/crystal.css')).text();
  expect(css).not.toMatch(/https?:\/\//);
  const html = await (await request.get('/demos/aurelia/index.html')).text();
  expect(html).toContain('<meta name="robots" content="noindex">');
});

test('home links to the live demo and the work page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#demo iframe')).toHaveAttribute('src', /\/demos\/aurelia\//);
  await page.getByRole('link', { name: /See everything inside this app/ }).click();
  await expect(page).toHaveURL(/\/work$/);
});

test('contact API validates input and reports when mail is not configured', async ({ request }) => {
  const old = Date.now() - 10_000;
  const ok = {
    name: 'Asha',
    email: 'asha@example.org',
    brief: 'A booking dashboard for our clinic.',
    service: 'Web application',
    startedAt: old,
  };
  const post = (data: object) => request.post('/api/contact', { data });
  expect((await post({ ...ok, email: 'nope' })).status()).toBe(422);
  expect((await post({ ...ok, service: '<script>' })).status()).toBe(422);
  expect((await post({ ...ok, brief: 'x'.repeat(3001) })).status()).toBe(422);
  // Spam traps answer "ok" without sending.
  expect(await (await post({ ...ok, hp: 'filled' })).json()).toEqual({ ok: true });
  expect(await (await post({ ...ok, startedAt: Date.now() })).json()).toEqual({ ok: true });
  // The test build has no RESEND_API_KEY, so a valid enquiry is reported, not lost.
  expect((await post(ok)).status()).toBe(503);
  const form = await request.post('/api/contact', { form: { name: 'x' } });
  expect(form.status()).toBe(415);
});

test('contact form shows success when the enquiry is accepted', async ({ page }) => {
  await page.route('**/api/contact', (r) => r.fulfill({ json: { ok: true } }));
  await page.goto('/contact?service=app');
  const form = page.locator('#project-brief form');
  await expect(form.getByLabel('What do you need?')).toHaveValue('Mobile app');
  await form.getByLabel('Your name', { exact: true }).fill('Asha Rao');
  await form.getByLabel('Email address', { exact: true }).fill('asha@example.org');
  await form.getByLabel('What would you like to achieve?').fill('An owner app for our township.');
  await form.getByRole('button', { name: /Send project brief/ }).click();
  await expect(page.getByRole('status')).toContainText('Thanks, Asha. Your brief is with us.');
});

test('privacy notice describes the form, demos and hosting', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy notice' })).toBeVisible();
  for (const h of ['Project enquiries', 'Cookies and analytics', 'Interactive demos', 'Hosting'])
    await expect(page.getByRole('heading', { level: 2, name: h })).toBeVisible();
});
