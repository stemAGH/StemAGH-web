import type { Product } from '@/content/products';
import { ProductCard } from './product-card';

/** One product gets a comfortable reading width; two or more share a two-column grid. */
export function ProductGrid({ products }: { products: Product[] }) {
  const layout = products.length > 1 ? 'lg:grid-cols-2' : 'max-w-3xl';
  return (
    <div className={`grid gap-6 ${layout}`}>
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
