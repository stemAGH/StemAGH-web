import Link from 'next/link';
import { modelLabels, type Product } from '@/content/products';
import { ProductAccent } from './product-accent';
import { StatusBadge } from './status-badge';

export function ProductCard({ product }: { product: Product }) {
  const facts = [
    ...product.model.map((m) => modelLabels[m]),
    ...(product.license ? [product.license] : []),
  ];
  return (
    <ProductAccent accent={product.accent} className="h-full">
      <article className="group relative flex h-full flex-col rounded-card border border-t-2 border-line border-t-product bg-surface p-6 transition-shadow hover:shadow-md sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">{product.category}</p>
          <StatusBadge status={product.status} />
        </div>
        <h3 className="mt-6 text-2xl font-semibold tracking-tight">
          {/* The stretched ::after makes the whole card one click target. */}
          <Link
            href={`/products/${product.slug}`}
            className="after:absolute after:inset-0 after:rounded-card"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-ink">{product.tagline}</p>
        <p className="mt-3 text-pretty text-ink-muted">{product.summary}</p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${product.name} facts`}>
          {facts.map((f) => (
            <li
              key={f}
              className="rounded-control bg-surface-muted px-2.5 py-1 text-xs font-medium text-ink-muted"
            >
              {f}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm font-medium text-accent">
          View {product.name}
          <span
            aria-hidden
            className="ml-1 inline-block transition-transform group-hover:translate-x-0.5"
          >
            &rarr;
          </span>
        </p>
      </article>
    </ProductAccent>
  );
}
