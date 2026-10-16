import type { Metadata } from 'next';
import { Container } from '@/components/container';
import { JsonLd } from '@/components/json-ld';
import { ButtonLink, TextLink } from '@/components/links';
import { ModelList } from '@/components/model-list';
import { PortfolioDiagram } from '@/components/portfolio-diagram';
import { ProductAccent } from '@/components/product-accent';
import { ProductGrid } from '@/components/product-grid';
import { Section, SectionHeading } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import { featuredProduct, products } from '@/content/products';
import { principles } from '@/content/principles';
import { openGraph } from '@/content/seo';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: { absolute: 'StemAGH | Dependable software for complex business operations' },
  description: site.description,
  openGraph: openGraph(
    'StemAGH | Dependable software for complex business operations',
    site.description,
    '/',
  ),
};

const ways = [
  {
    title: 'Run OpenEstate',
    body: 'Install it on a server you control. You provide PostgreSQL, Redis and nginx; the installer does the rest.',
    cta: 'Installation guide',
    href: featuredProduct.links.install,
  },
  {
    title: 'Read the source',
    body: 'The code, the changelog and the issue tracker are public, so you can judge the product before you rely on it.',
    cta: 'View on GitHub',
    href: featuredProduct.links.repo,
  },
  {
    title: 'Ask or report',
    body: 'Questions, bugs and feature requests go through the public issue tracker. Security reports have their own policy.',
    cta: 'Open the issue tracker',
    href: featuredProduct.links.issues,
  },
];

export default function HomePage() {
  const p = featuredProduct;
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: site.name,
          description: site.description,
        }}
      />

      {/* Hero */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:py-28">
          <div>
            <p className="text-sm font-medium tracking-wide text-accent uppercase">
              Software products
            </p>
            <h1
              id="hero-title"
              className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              Dependable software for{' '}
              <span className="text-accent">complex business operations</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-pretty text-ink-muted">
              StemAGH builds practical software products for operational workflows, open and
              adaptable where that serves the customer.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/products">Explore our products</ButtonLink>
              <ButtonLink href={`/products/${p.slug}`} variant="secondary">
                Discover {p.name}
              </ButtonLink>
            </div>
          </div>
          <PortfolioDiagram />
        </Container>
      </section>

      {/* Featured product */}
      <Section tone="muted" labelledBy="featured-title">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium tracking-wide text-accent uppercase">
            Featured product
          </p>
          <StatusBadge status={p.status} />
          {p.statusNote && <span className="text-sm text-ink-muted">{p.statusNote}</span>}
        </div>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <h2
              id="featured-title"
              className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
            >
              {p.name}: {p.tagline.charAt(0).toLowerCase() + p.tagline.slice(1, -1)}
            </h2>
            <p className="mt-4 text-lg text-pretty text-ink-muted">{p.summary}</p>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:max-w-md">
              <div>
                <dt className="text-ink-muted">Deployment</dt>
                <dd className="font-medium">
                  <ModelList models={p.model} />
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted">Licence</dt>
                <dd className="font-medium">{p.license}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Source</dt>
                <dd className="font-medium">Public on GitHub</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Current release</dt>
                <dd className="font-medium">{p.version}, pre-1.0</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={`/products/${p.slug}`}>Explore {p.name}</ButtonLink>
              {p.links.repo && (
                <ButtonLink href={p.links.repo} variant="secondary">
                  View on GitHub
                </ButtonLink>
              )}
            </div>
          </div>

          <ProductAccent accent={p.accent}>
            <ul className="grid gap-px overflow-hidden rounded-card border border-line bg-line">
              {p.highlights.map((h, i) => (
                <li key={h.title} className="flex gap-4 bg-surface p-5 sm:p-6">
                  <span aria-hidden className="font-mono text-sm text-product">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-semibold">{h.title}</h3>
                    <p className="mt-1 text-sm text-pretty text-ink-muted">{h.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </ProductAccent>
        </div>
      </Section>

      {/* Portfolio */}
      <Section labelledBy="portfolio-title">
        <SectionHeading
          id="portfolio-title"
          eyebrow="Portfolio"
          title="Products built under one roof"
          intro="Each StemAGH product stands on its own, with its own audience and delivery model. Today there is one."
        />
        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
        <p className="mt-6 text-sm text-ink-muted">
          More products will be introduced as they are ready.
        </p>
      </Section>

      {/* How we build */}
      <Section tone="muted" labelledBy="approach-title">
        <SectionHeading
          id="approach-title"
          eyebrow="How we build"
          title="Principles we hold ourselves to"
          intro="The headings are how StemAGH intends to work. The notes beneath describe what that looks like in OpenEstate today."
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
                <span className="font-medium text-ink">In {featuredProduct.name}: </span>
                {item.evidence}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Engagement */}
      <Section labelledBy="engage-title">
        <SectionHeading
          id="engage-title"
          eyebrow="Get involved"
          title="Ways to engage today"
          intro="These are the routes that exist today."
        />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {ways.map((w) => (
            <li
              key={w.title}
              className="flex flex-col rounded-card border border-line bg-surface p-6"
            >
              <h3 className="text-lg font-semibold">{w.title}</h3>
              <p className="mt-2 flex-1 text-pretty text-ink-muted">{w.body}</p>
              {w.href && (
                <p className="mt-5">
                  <TextLink href={w.href}>{w.cta}</TextLink>
                </p>
              )}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
