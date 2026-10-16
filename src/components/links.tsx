import Link from 'next/link';

const isExternal = (href: string) => /^https?:\/\//.test(href);

const external = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const;

function NewTabHint({ href }: { href: string }) {
  return isExternal(href) ? <span className="sr-only"> (opens in a new tab)</span> : null;
}

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-control px-5 py-3 text-sm font-medium transition-colors';

const variants = {
  primary: 'bg-accent text-accent-contrast hover:bg-accent-hover',
  secondary: 'border border-line-strong bg-surface text-ink hover:bg-surface-muted',
} as const;

type LinkProps = { href: string; className?: string; children: React.ReactNode };

export function ButtonLink({
  href,
  variant = 'primary',
  className = '',
  children,
}: LinkProps & { variant?: keyof typeof variants }) {
  const cls = `${buttonBase} ${variants[variant]} ${className}`;
  return isExternal(href) ? (
    <a href={href} className={cls} {...external}>
      {children}
      <NewTabHint href={href} />
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/** Inline text link. External links open in a new tab and say so to screen readers. */
export function TextLink({ href, className = '', children }: LinkProps) {
  const cls = `font-medium text-accent underline underline-offset-4 hover:text-accent-hover ${className}`;
  return isExternal(href) ? (
    <a href={href} className={cls} {...external}>
      {children}
      <NewTabHint href={href} />
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
