import Link from 'next/link';
import { featuredProduct } from '@/content/products';
import { StatusBadge } from './status-badge';

/**
 * Hero graphic: the brand-to-product structure, drawn with real data only.
 * The dashed slot is an honest placeholder for future products, not a product.
 */
export function PortfolioDiagram() {
  const p = featuredProduct;
  return (
    <figure className="rounded-card border border-line bg-surface p-5 shadow-sm sm:p-6">
      <figcaption className="sr-only">
        StemAGH is the parent brand. OpenEstate is its first product. More products will follow.
      </figcaption>

      <div className="rounded-control border border-line-strong bg-canvas px-4 py-3">
        <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">Parent brand</p>
        <p className="mt-0.5 text-lg font-semibold tracking-tight">
          Stem<span className="text-accent">AGH</span>
        </p>
      </div>

      <div aria-hidden className="ml-8 h-6 w-px bg-line-strong" />

      <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">Products</p>
      <ul className="mt-3 space-y-3 border-l border-line-strong pl-5 sm:pl-6">
        <li className="relative">
          <span
            aria-hidden
            className="absolute top-1/2 -left-5 h-px w-5 bg-line-strong sm:-left-6 sm:w-6"
          />
          <Link
            href={`/products/${p.slug}`}
            className="block rounded-control border border-accent/40 bg-accent-soft/50 p-4 transition-colors hover:bg-accent-soft"
          >
            <span className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-base font-semibold">{p.name}</span>
              <StatusBadge status={p.status} />
            </span>
            <span className="mt-1 block text-sm text-ink-muted">{p.category}</span>
          </Link>
        </li>
        <li className="relative">
          <span
            aria-hidden
            className="absolute top-1/2 -left-5 h-px w-5 bg-line-strong sm:-left-6 sm:w-6"
          />
          <div className="rounded-control border border-dashed border-line-strong p-4 text-sm text-ink-muted">
            More products will be introduced as they are ready.
          </div>
        </li>
      </ul>
    </figure>
  );
}
