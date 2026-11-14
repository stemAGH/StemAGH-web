import type { MetadataRoute } from 'next';
import { outagePost } from '@/content/outage-post';
import { products } from '@/content/products';
import { siteUrl } from '@/content/seo';

// Empty until SITE_URL is set: sitemap entries must be absolute URLs on the real domain.
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  const paths = [
    '',
    '/services',
    '/work',
    '/products',
    ...products.map((p) => `/products/${p.slug}`),
    '/products/openestate/install',
    '/about',
    '/contact',
    '/privacy',
    '/insights',
    `/insights/${outagePost.slug}`,
  ];
  return paths.map((p) => ({ url: `${siteUrl}${p}` }));
}
