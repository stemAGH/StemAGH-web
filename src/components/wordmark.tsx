import Link from 'next/link';
import { LogoMark } from './logo-mark';

/** Mark plus typographic wordmark. The one place the brand lockup is defined. */
export function Wordmark() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-ink"
      aria-label="StemAGH home"
    >
      <LogoMark className="text-accent" />
      <span>
        Stem<span className="text-accent">AGH</span>
      </span>
    </Link>
  );
}
