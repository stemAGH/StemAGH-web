'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  href: string;
  match: 'exact' | 'prefix';
  className: string;
  activeClassName: string;
  onNavigate?: () => void;
  children: React.ReactNode;
};

/** Link that marks itself with aria-current when its route is showing. */
export function NavLink({ href, match, className, activeClassName, onNavigate, children }: Props) {
  const pathname = usePathname();
  const active = match === 'exact' ? pathname === href : pathname.startsWith(href);
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      onClick={onNavigate}
      className={`${className} ${active ? activeClassName : ''}`}
    >
      {children}
    </Link>
  );
}
