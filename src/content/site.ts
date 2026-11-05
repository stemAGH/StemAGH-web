export const site = {
  /** General enquiry address. Provided by the owner. Set to undefined to fall back to the "no address yet" note on /contact. */
  contactEmail: 'contact@stemagh.com' as string | undefined,
  name: 'StemAGH',
  /**
   * Web3Forms access key for the enquiry form; it decides which inbox receives enquiries.
   * Public by design (Web3Forms only accepts browser submissions), so it lives here, not in a
   * secret. Get one at web3forms.com for contact@stemagh.com. Empty: the form offers an email draft.
   */
  web3formsKey: 'f0e79503-fe55-41bf-a872-d86c35157885' as string,
  description:
    'StemAGH designs and builds business websites, mobile apps and custom software for companies across India.',
};

export const navLinks = [
  { href: '/services', label: 'Services', match: 'exact' },
  { href: '/work', label: 'Work', match: 'exact' },
  { href: '/products', label: 'Products', match: 'prefix' },
  { href: '/about', label: 'About', match: 'exact' },
  { href: '/contact', label: 'Contact', match: 'exact' },
] as const;
