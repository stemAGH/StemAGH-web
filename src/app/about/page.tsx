import type { Metadata } from 'next';
import { openGraph } from '@/content/seo';
import { Container } from '@/components/container';
import { ButtonLink, TextLink } from '@/components/links';
import { ProductGrid } from '@/components/product-grid';
import { Section, SectionHeading } from '@/components/section';
import { principles } from '@/content/principles';
import { featuredProduct, products } from '@/content/products';

const description =
  'StemAGH builds business websites, web applications and custom software, alongside its open-source real estate operations product, OpenEstate.';

export const metadata: Metadata = {
  title: 'About',
  description,
  openGraph: openGraph('About | StemAGH', description, '/about'),
};

export default function AboutPage() {
  const p = featuredProduct;
  return (
    <>
      <section aria-labelledby="about-title" className="border-b border-line bg-surface">
        <Container className="py-14 sm:py-20">
          <p className="text-sm font-medium tracking-wide text-accent uppercase">About</p>
          <h1
            id="about-title"
            className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
          >
            Websites, custom software and products built for real work
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-pretty text-ink-muted">
            StemAGH builds business websites, web applications and custom software for real business
            workflows. It is the parent brand: it builds and maintains a portfolio of products, each
            with its own audience, and today that portfolio is one product, {p.name}.
          </p>
        </Container>
      </section>

      <Section labelledBy="what-title">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <SectionHeading
            id="what-title"
            eyebrow="What StemAGH is"
            title="One brand, many products"
          />
          <div className="space-y-4 text-lg text-pretty text-ink-muted">
            <p>
              StemAGH is not tied to one industry. A product earns a place in the portfolio by
              solving a concrete operational problem well, not by fitting a sector.
            </p>
            <p>
              {p.name} is the first, in {p.category.toLowerCase()}. It is one product under the
              StemAGH brand, not a description of the brand itself.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="muted" labelledBy="principles-title">
        <SectionHeading
          id="principles-title"
          eyebrow="How we build"
          title="What we aim for, and what is already true"
          intro={`The headings are StemAGH's aims for every product. The notes beneath are what is established in ${p.name} today. Future products will be held to the same aims, and each one will say plainly where it falls short.`}
        />
        <ol className="mt-10 grid gap-6 sm:grid-cols-2">
          {principles.map((item, i) => (
            <li key={item.title} className="rounded-card border border-line bg-surface p-6">
              <span aria-hidden className="font-mono text-sm text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-pretty text-ink-muted">{item.body}</p>
              <p className="mt-4 border-t border-line pt-4 text-sm text-pretty text-ink-muted">
                <span className="font-medium text-ink">Established in {p.name}: </span>
                {item.evidence}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section labelledBy="portfolio-title">
        <SectionHeading
          id="portfolio-title"
          eyebrow="Current portfolio"
          title="What exists today"
        />
        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
        {p.links.repo && (
          <p className="mt-6">
            <TextLink href={p.links.repo}>{p.name} source on GitHub</TextLink>
          </p>
        )}
      </Section>

      <Section tone="muted" labelledBy="future-title">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <SectionHeading id="future-title" eyebrow="Direction" title="The portfolio may grow" />
          <div className="space-y-4 text-lg text-pretty text-ink-muted">
            <p>
              More products may be added over time, in other industries and with other delivery
              models: open source, SaaS or commercial. None is announced, and nothing is promised
              until it is ready to be used.
            </p>
            <p>
              New products will appear on the products page with an honest status, so planned work
              is never presented as something you can use.
            </p>
          </div>
        </div>
      </Section>

      <Section labelledBy="next-title">
        <h2 id="next-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
          See what is available
        </h2>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/products">Explore products</ButtonLink>
          <ButtonLink href={`/products/${p.slug}`} variant="secondary">
            Discover {p.name}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
