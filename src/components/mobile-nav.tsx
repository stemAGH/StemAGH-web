'use client';

import { useEffect, useRef, useState } from 'react';
import { navLinks } from '@/content/site';
import { ButtonLink } from './links';
import { NavLink } from './nav-link';

/** Disclosure menu for small screens. Escape closes it and returns focus to the button. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 items-center rounded-control border border-line-strong px-3 text-sm font-medium text-ink hover:bg-surface-muted"
      >
        {open ? 'Close' : 'Menu'}
        <span className="sr-only"> navigation</span>
      </button>
      {open && (
        <div
          id="mobile-nav"
          className="absolute inset-x-0 top-full border-b border-line bg-surface px-gutter py-3 shadow-sm"
        >
          <ul>
            {navLinks.map((l) => (
              <li key={l.href}>
                <NavLink
                  href={l.href}
                  match={l.match}
                  onNavigate={() => setOpen(false)}
                  className="block rounded-control px-2 py-3 text-base font-medium text-ink hover:bg-surface-muted"
                  activeClassName="bg-accent-soft text-accent"
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-2 pb-2" onClick={() => setOpen(false)}>
            <ButtonLink href="/contact" className="w-full">
              Discuss your project
            </ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}
