import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/container';

// No canonical: the layout default would point at the internal /_not-found route.
export const metadata: Metadata = {
  title: 'Page not found',
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <Container className="py-24">
      <p className="text-sm font-medium text-accent">Error 404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-ink-muted">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="mt-6 inline-block font-medium text-accent underline underline-offset-4"
      >
        Back to the homepage
      </Link>
    </Container>
  );
}
