export const site = {
  /** General enquiry address. Provided by the owner. Set to undefined to fall back to the "no address yet" note on /contact. */
  contactEmail: 'contact@stemagh.com' as string | undefined,
  name: 'StemAGH',
  description:
    'StemAGH builds practical software products for complex operational workflows, open and adaptable where that serves the customer.',
};

export const navLinks = [
  { href: '/products', label: 'Products', match: 'exact' },
  { href: '/products/openestate', label: 'OpenEstate', match: 'prefix' },
  { href: '/about', label: 'About', match: 'exact' },
  { href: '/contact', label: 'Contact', match: 'exact' },
] as const;
