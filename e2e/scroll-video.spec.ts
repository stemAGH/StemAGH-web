import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { scrollProgress, videoTime } from '../src/components/scroll-video-timeline';

const configured = process.env.SCROLL_VIDEO_SRC === '/__scroll-video-test.mp4';
const bundled = !process.env.SCROLL_VIDEO_SRC;
const mediaPattern = configured ? '**/__scroll-video-test.mp4' : '**/media/stemagh-story.mp4';
const sectionSelector = 'section[aria-labelledby="film-title"]';

test('timeline clamps endpoints and reverses without hysteresis', () => {
  expect(scrollProgress(0, 100, 1000)).toBe(0);
  expect(scrollProgress(600, 100, 1000)).toBe(0.5);
  expect(scrollProgress(5000, 100, 1000)).toBe(1);
  expect(scrollProgress(350, 100, 1000)).toBe(0.25);
  expect(scrollProgress(100, 100, 0)).toBe(0);
  expect(videoTime(1, 4, 30)).toBeCloseTo(4 - 1 / 30);
  expect(videoTime(0.5, 4, 30)).toBeCloseTo((4 - 1 / 30) / 2);
  expect(videoTime(1, Infinity, 30)).toBe(0);
});

test('no source renders a compact readable section without media requests', async ({ page }) => {
  test.skip(process.env.SCROLL_VIDEO_SRC !== 'off', 'Explicitly disabled film configuration only');
  const media: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'media') media.push(request.url());
  });
  await page.goto('/');
  const section = page.locator(sectionSelector);
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveAttribute('data-mode', 'static');
  await expect(section.locator('video')).toHaveCount(0);
  await expect(section.getByRole('heading', { name: 'Launch with clarity.' })).toBeVisible();
  expect(await section.evaluate((el) => el.getBoundingClientRect().height)).toBeLessThan(1400);
  expect(media).toEqual([]);
});

test.describe('real video decoder', () => {
  test.skip(
    !bundled && (!configured || !process.env.SCROLL_VIDEO_TEST_FILE),
    'Enable the documented temporary media fixture run',
  );
  test.beforeEach(async ({ page }) => {
    if (!configured) return;
    const buffer = readFileSync(process.env.SCROLL_VIDEO_TEST_FILE!);
    await page.route('**/__scroll-video-test.mp4', (route) => {
      const range = route.request().headers().range;
      if (!range)
        return route.fulfill({
          contentType: 'video/mp4',
          headers: { 'Accept-Ranges': 'bytes' },
          body: buffer,
        });
      const match = /bytes=(\d+)-(\d*)/.exec(range)!;
      const start = Number(match[1]);
      const end = Math.min(match[2] ? Number(match[2]) : buffer.length - 1, buffer.length - 1);
      return route.fulfill({
        status: 206,
        contentType: 'video/mp4',
        headers: {
          'Accept-Ranges': 'bytes',
          'Content-Range': `bytes ${start}-${end}/${buffer.length}`,
        },
        body: buffer.subarray(start, end + 1),
      });
    });
  });

  test('desktop seeks forward, backwards and to both ends while pinned', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Mobile intentionally uses native playback');
    await page.goto('/');
    const section = page.locator(sectionSelector);
    await page.evaluate((selector) => {
      const el = document.querySelector(selector)!;
      scrollTo({
        top: el.getBoundingClientRect().top + scrollY - innerHeight - 200,
        behavior: 'instant',
      });
    }, sectionSelector);
    await expect(section).toHaveAttribute('data-mode', 'scrub');
    for (const progress of [0, 0.5, 1, 0.25, 0]) {
      await section.evaluate((el, p) => {
        const pin = el.firstElementChild as HTMLElement;
        const top = parseFloat(getComputedStyle(pin).top);
        scrollTo({
          top:
            el.getBoundingClientRect().top +
            scrollY -
            top +
            p * (el.clientHeight - pin.offsetHeight),
          behavior: 'instant',
        });
      }, progress);
      await expect
        .poll(() =>
          section
            .locator('video')
            .evaluate(
              (v, p) =>
                Math.abs(
                  (v as HTMLVideoElement).currentTime -
                    p * ((v as HTMLVideoElement).duration - 1 / 30),
                ),
              progress,
            ),
        )
        .toBeLessThan(0.08);
      const pinTop = await section.evaluate(
        (el) => el.firstElementChild!.getBoundingClientRect().top,
      );
      expect(pinTop).toBeCloseTo(80, 0);
    }
  });

  test('reduced motion and mobile use explicitly requested native playback', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const section = page.locator(sectionSelector);
    await expect(section).toHaveAttribute('data-mode', 'native');
    await expect(section.locator('video')).not.toHaveAttribute('src');
    await section.getByRole('button', { name: 'Load and play film' }).click();
    await expect
      .poll(() =>
        section
          .locator('video')
          .evaluate(
            (v) => !(v as HTMLVideoElement).paused && (v as HTMLVideoElement).currentTime > 0.05,
          ),
      )
      .toBe(true);
    await expect(section.locator('video')).toHaveAttribute('controls', '');
    expect(await section.evaluate((el) => el.getBoundingClientRect().height)).toBeLessThan(1600);
  });

  test('failed media keeps content readable without a long pin', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop automatic loading path');
    await page.unroute(mediaPattern);
    await page.route(mediaPattern, (route) => route.fulfill({ status: 404, body: 'Unavailable' }));
    await page.goto('/');
    const section = page.locator(sectionSelector);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveAttribute('data-mode', 'error');
    await expect(section.getByRole('heading', { name: 'Start with the problem.' })).toBeVisible();
    expect(await section.evaluate((el) => el.getBoundingClientRect().height)).toBeLessThan(1400);
  });
});
