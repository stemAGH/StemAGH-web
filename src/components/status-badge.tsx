import { statusLabels, type ProductStatus } from '@/content/products';

const styles: Record<ProductStatus, string> = {
  available: 'border-accent/30 bg-accent-soft text-accent',
  'in-development': 'border-line-strong bg-surface text-ink-muted',
  planned: 'border-dashed border-line-strong bg-surface text-ink-muted',
};

/** Status is always conveyed in words, never by colour alone. */
export function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {statusLabels[status]}
    </span>
  );
}
