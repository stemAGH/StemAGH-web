import { expect, test } from '@playwright/test';
import { parseSiteUrl } from '../src/content/site-url';

test.skip(({ isMobile }) => isMobile, 'pure function; run once');

const OK = 'https://www.stemagh.com';

test('accepts the canonical production origin', () => {
  expect(parseSiteUrl(OK)).toBe(OK);
  expect(parseSiteUrl(OK, { VERCEL_ENV: 'production' })).toBe(OK);
});

test('unset is allowed locally and on previews, but fails a Vercel production build', () => {
  expect(parseSiteUrl(undefined)).toBeUndefined();
  expect(parseSiteUrl('', { VERCEL_ENV: 'preview' })).toBeUndefined();
  expect(() => parseSiteUrl(undefined, { VERCEL_ENV: 'production' })).toThrow(
    /SITE_URL is required/,
  );
  expect(() => parseSiteUrl('  ', { VERCEL_ENV: 'production' })).toThrow(/SITE_URL is required/);
});

for (const [bad, why] of [
  ['www.stemagh.com', 'no scheme'],
  ['http://www.stemagh.com', 'http'],
  ['https://www.stemagh.com/', 'trailing slash'],
  ['https://www.stemagh.com/about', 'path'],
  ['https://www.stemagh.com?x=1', 'query'],
  ['https://user:pw@www.stemagh.com', 'credentials'],
  ['https://localhost', 'localhost'],
  ['https://localhost:3000', 'localhost port'],
  ['https://127.0.0.1', 'ip'],
  ['https://example.com', 'placeholder'],
  ['https://example.test', 'reserved tld'],
  ['https://intranet', 'no dot'],
] as const) {
  test(`rejects ${why}: ${bad}`, () => {
    expect(() => parseSiteUrl(bad)).toThrow(/Invalid SITE_URL/);
  });
}
