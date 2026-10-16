import type { CSSProperties } from 'react';

/** Scopes a product's accent colour to its subtree; `text-product` / `bg-product` read it. */
export function ProductAccent({
  accent,
  className,
  children,
}: {
  accent: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className} style={{ '--color-product': accent } as CSSProperties}>
      {children}
    </div>
  );
}
