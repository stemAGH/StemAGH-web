import type { MetadataRoute } from 'next';
import { products } from '@/content/products';
import { siteUrl } from '@/content/seo';

// Empty until SITE_URL is set: sitemap entries must be absolute URLs on the real domain.
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  const paths = [
    '',
    '/services',
    '/products',
    ...products.map((p) => `/products/${p.slug}`),
    '/about',
    '/contact',
  ];
  return paths.map((p) => ({ url: `${siteUrl}${p}` }));
}
