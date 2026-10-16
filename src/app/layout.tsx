import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { siteUrl } from '@/content/seo';
import { site } from '@/content/site';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import './globals.css';

// Canonical URLs, og:image and the sitemap switch on with SITE_URL (see content/seo.ts).
export const metadata: Metadata = {
  title: { default: 'StemAGH', template: '%s | StemAGH' },
  description: site.description,
  ...(siteUrl && {
    metadataBase: new URL(siteUrl),
    alternates: { canonical: './' },
    twitter: { card: 'summary_large_image' },
  }),
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="fixed top-3 left-3 z-50 -translate-y-20 rounded-control bg-accent px-4 py-2 text-sm font-medium text-accent-contrast focus:translate-y-0"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
