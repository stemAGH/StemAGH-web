import type { Metadata } from 'next';

import { parseSiteUrl } from './site-url';

/**
 * Domain-dependent metadata (canonical links, og:image, sitemap) comes from the
 * build-time SITE_URL, validated by parseSiteUrl. Unset means off, except on a
 * Vercel production build, which fails. See docs/launch.md.
 */
export const siteUrl = parseSiteUrl(process.env.SITE_URL, { VERCEL_ENV: process.env.VERCEL_ENV });

/** Open Graph for a page. Shared fields live here so every route stays consistent. */
export function openGraph(
  title: string,
  description: string,
  path: string,
): NonNullable<Metadata['openGraph']> {
  return {
    title,
    description,
    type: 'website',
    siteName: 'StemAGH',
    ...(siteUrl && {
      url: path === '/' ? siteUrl : `${siteUrl}${path}`,
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: 'StemAGH — websites, web applications and custom software',
        },
      ],
    }),
  };
}
