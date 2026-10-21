import { navLinks } from '@/content/site';
import { Container } from './container';
import { ButtonLink } from './links';
import { MobileNav } from './mobile-nav';
import { NavLink } from './nav-link';
import { Wordmark } from './wordmark';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur-sm">
      <Container className="relative flex h-20 items-center justify-between">
        <Wordmark />
        <div className="hidden items-center gap-2 md:flex">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-1">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <NavLink
                    href={l.href}
                    match={l.match}
                    className="rounded-control px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
                    activeClassName="bg-accent-soft text-accent!"
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <ButtonLink href="/contact" className="ml-4 py-3! max-lg:hidden">
            Let’s talk ↗
          </ButtonLink>
        </div>
        <MobileNav />
      </Container>
    </header>
  );
}
