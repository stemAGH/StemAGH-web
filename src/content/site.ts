export const site = {
  /** General enquiry address. Provided by the owner. Set to undefined to fall back to the "no address yet" note on /contact. */
  contactEmail: 'contact@stemagh.com' as string | undefined,
  name: 'StemAGH',
  description:
    'StemAGH designs and builds business websites, web applications and custom software. Thoughtful design, practical tools and a clear path to launch.',
};

export const navLinks = [
  { href: '/#services', label: 'Services', match: 'exact' },
  { href: '/products', label: 'Products', match: 'exact' },
  { href: '/products/openestate', label: 'OpenEstate', match: 'prefix' },
  { href: '/about', label: 'About', match: 'exact' },
  { href: '/contact', label: 'Contact', match: 'exact' },
] as const;
