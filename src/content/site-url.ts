/**
 * Validates the build-time SITE_URL. Pure, so e2e/site-url.spec.ts can test it.
 *
 * - Unset: domain-dependent metadata is off, except on a Vercel production build,
 *   where shipping without a canonical URL is a mistake, so the build fails.
 * - Set: it must be a clean https origin on a real host. Anything else fails the
 *   build rather than being "fixed" silently, so a typo never reaches production.
 */
const PLACEHOLDER_HOST =
  /(^|\.)(localhost|test|invalid|local|example|internal)$|^(example\.(com|org|net))$|^(\d{1,3}\.){3}\d{1,3}$|^\[/;

export function parseSiteUrl(
  raw: string | undefined,
  env: { VERCEL_ENV?: string } = {},
): string | undefined {
  if (raw === undefined || raw.trim() === '') {
    if (env.VERCEL_ENV === 'production') {
      throw new Error(
        'SITE_URL is required for production builds. Set it in Vercel (Production), e.g. SITE_URL=https://www.example.org, then redeploy. See docs/launch.md.',
      );
    }
    return undefined;
  }
  const fail = (why: string): never => {
    throw new Error(
      `Invalid SITE_URL "${raw}": ${why}. Expected an https origin such as https://www.example.org (no path, no trailing slash).`,
    );
  };
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return fail('not a valid URL');
  }
  if (url.protocol !== 'https:') fail('must use https');
  if (raw.endsWith('/')) fail('must not end with a slash');
  if (url.pathname !== '/' || url.search || url.hash || url.username || url.password)
    fail('must be an origin only');
  if (!url.hostname.includes('.') || PLACEHOLDER_HOST.test(url.hostname))
    fail('looks like a local or placeholder host');
  return raw;
}
