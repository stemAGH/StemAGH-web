import Link from 'next/link';
import { featuredProduct } from '@/content/products';
import { services } from '@/content/services';
import { navLinks, site } from '@/content/site';
import { Container } from './container';

const linkCls = 'text-sm text-[#b6c6e5] hover:text-white hover:underline underline-offset-4';
const headCls = 'text-xs font-semibold tracking-[0.13em] text-white uppercase';

export function SiteFooter() {
  const { links } = featuredProduct;
  return (
    <footer className="site-footer border-t border-white/10 bg-[#0b152b] text-[#f4f7ff]">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
        <div className="max-w-sm">
          <p className="text-2xl font-semibold tracking-tight">StemAGH</p>
          <p className="mt-3 text-sm text-pretty text-[#b6c6e5]">{site.description}</p>
          <Link href="/contact#project-brief" className="studio-button mt-6">
            Start a project <span>↗</span>
          </Link>
        </div>

        <nav aria-label="Services">
          <h2 className={headCls}>Services</h2>
          <ul className="mt-4 space-y-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services#${s.slug}`} className={linkCls}>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer">
          <h2 className={headCls}>Company</h2>
          <ul className="mt-4 space-y-3">
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
          <h2 className={headCls}>Get in touch</h2>
          <ul className="mt-4 space-y-3">
            {site.contactEmail && (
              <li>
                <a href={`mailto:${site.contactEmail}`} className={linkCls}>
                  {site.contactEmail}
                </a>
              </li>
            )}
            <li>
              <Link href="/contact#project-brief" className={linkCls}>
                Send a project brief
              </Link>
            </li>
            {links.repo && (
              <li>
                <a href={links.repo} className={linkCls} target="_blank" rel="noopener noreferrer">
                  {featuredProduct.name} on GitHub
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-sm text-[#b6c6e5] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} StemAGH. Websites, web apps and custom software.</p>
          <ul className="flex gap-6">
            <li>
              <Link href="/privacy" className={linkCls}>
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/work" className={linkCls}>
                Live demo
              </Link>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
