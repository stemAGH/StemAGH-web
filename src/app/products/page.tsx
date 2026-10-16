import type { Metadata } from 'next';
import { openGraph } from '@/content/seo';
import { Container } from '@/components/container';
import { ProductGrid } from '@/components/product-grid';
import { products } from '@/content/products';

const description =
  'The StemAGH product portfolio: software for complex business operations, starting with OpenEstate.';

export const metadata: Metadata = {
  title: 'Products',
  description,
  openGraph: openGraph('Products | StemAGH', description, '/products'),
};

export default function ProductsPage() {
  return (
    <>
      <section aria-labelledby="products-title" className="border-b border-line bg-surface">
        <Container className="py-14 sm:py-20">
          <p className="text-sm font-medium tracking-wide text-accent uppercase">Portfolio</p>
          <h1
            id="products-title"
            className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
          >
            Products
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-pretty text-ink-muted">
            StemAGH products are built for different industries and delivered in different ways:
            open source, self-hosted, SaaS or commercial. Each page states what exists today and
            what does not.
          </p>
        </Container>
      </section>

      <Container className="py-14 sm:py-20">
        <h2 className="sr-only">All products</h2>
        <ProductGrid products={products} />
        <p
          className={`mt-6 rounded-card border border-dashed border-line-strong p-6 text-ink-muted ${products.length > 1 ? '' : 'max-w-3xl'}`}
        >
          More products will be introduced as they are ready.
        </p>
      </Container>
    </>
  );
}
