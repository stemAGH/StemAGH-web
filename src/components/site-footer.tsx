import Link from 'next/link';
import { featuredProduct } from '@/content/products';
import { navLinks, site } from '@/content/site';
import { Container } from './container';
import { TextLink } from './links';
import { Wordmark } from './wordmark';

const linkCls = 'text-sm text-ink-muted hover:text-ink hover:underline underline-offset-4';

export function SiteFooter() {
  const { links } = featuredProduct;
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="grid gap-10 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm">
          <Wordmark />
          <p className="mt-3 text-sm text-pretty text-ink-muted">{site.description}</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold">Site</h2>
          <ul className="mt-3 space-y-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold">{featuredProduct.name} on GitHub</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {links.repo && (
              <li>
                <TextLink href={links.repo} className="font-normal!">
                  Source repository
                </TextLink>
              </li>
            )}
            {links.install && (
              <li>
                <TextLink href={links.install} className="font-normal!">
                  Installation guide
                </TextLink>
              </li>
            )}
            {links.license && (
              <li>
                <TextLink href={links.license} className="font-normal!">
                  {featuredProduct.license} licence
                </TextLink>
              </li>
            )}
          </ul>
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="py-5">
          <p className="text-sm text-ink-muted">&copy; {new Date().getFullYear()} StemAGH</p>
        </Container>
      </div>
    </footer>
  );
}
