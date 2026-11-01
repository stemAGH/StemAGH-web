export const site = {
  /** General enquiry address. Provided by the owner. Set to undefined to fall back to the "no address yet" note on /contact. */
  contactEmail: 'contact@stemagh.com' as string | undefined,
  name: 'StemAGH',
  description:
    'StemAGH designs and builds business websites, mobile apps and custom software for companies across India, from offices in Chennai and Gurugram.',
  /** Cities StemAGH works from. Shown in copy and in the Organization data Google reads. */
  locations: [
    { city: 'Chennai', region: 'Tamil Nadu' },
    { city: 'Gurugram', region: 'Haryana' },
  ],
};

export const navLinks = [
  { href: '/services', label: 'Services', match: 'exact' },
  { href: '/work', label: 'Work', match: 'exact' },
  { href: '/products', label: 'Products', match: 'prefix' },
  { href: '/about', label: 'About', match: 'exact' },
  { href: '/contact', label: 'Contact', match: 'exact' },
] as const;
