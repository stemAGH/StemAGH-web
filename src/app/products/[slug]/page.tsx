import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/container';
import { FaqAccordion } from '@/components/faq-accordion';
import { JsonLd } from '@/components/json-ld';
import { ModelList } from '@/components/model-list';
import { ProductAccent } from '@/components/product-accent';
import { ButtonLink, TextLink } from '@/components/links';
import { Section, SectionHeading } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import { openGraph } from '@/content/seo';
import { getProduct, products } from '@/content/products';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.summary,
    openGraph: openGraph(`${product.name} | StemAGH`, product.summary, `/products/${product.slug}`),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const { links } = product;
  const reviewed = new Date(product.reviewedOn).toLocaleDateString('en-GB', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const facts = [
    { label: 'Status', value: product.statusNote ?? '' },
    { label: 'Release', value: product.version ?? '' },
    { label: 'Licence', value: product.license ?? '' },
    { label: 'Delivery', value: <ModelList models={product.model} /> },
  ].filter((f) => f.value);

  return (
    <ProductAccent accent={product.accent}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: product.name,
          description: product.summary,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Linux',
          ...(product.version && { softwareVersion: product.version.replace(/^v/, '') }),
          ...(links.license && { license: links.license }),
          ...(links.repo && { sameAs: links.repo }),
          author: { '@type': 'Organization', name: 'StemAGH' },
        }}
      />

      {/* Intro */}
      <section aria-labelledby="product-title" className="border-b border-line bg-surface">
        <Container className="py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-muted">
            <ol className="flex items-center gap-2">
              <li>
                <Link
                  href="/products"
                  className="underline-offset-4 hover:text-ink hover:underline"
                >
                  Products
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page">{product.name}</li>
            </ol>
          </nav>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <StatusBadge status={product.status} />
            <span className="text-sm text-ink-muted">{product.category}</span>
          </div>
          <h1
            id="product-title"
            className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          >
            {product.name}
          </h1>
          <p className="mt-5 max-w-3xl text-xl text-pretty text-ink">{product.tagline}</p>
          <p className="mt-4 max-w-3xl text-lg text-pretty text-ink-muted">{product.summary}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {links.repo && <ButtonLink href={links.repo}>View on GitHub</ButtonLink>}
            {links.install && (
              <ButtonLink href={links.install} variant="secondary">
                Read the installation guide
              </ButtonLink>
            )}
          </div>
          <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="bg-canvas p-4">
                <dt className="text-sm text-ink-muted">{f.label}</dt>
                <dd className="mt-1 font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Audience */}
      <Section labelledBy="audience-title">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <SectionHeading
            id="audience-title"
            eyebrow="Who it is for"
            title="The teams it is built for"
          />
          <ul className="space-y-3 text-lg text-ink-muted">
            {product.audience.map((a) => (
              <li key={a} className="flex gap-3 border-b border-line pb-3 last:border-0">
                <span aria-hidden className="text-product">
                  &rarr;
                </span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* How it works — step-by-step workflow */}
      {product.workflow && product.workflow.length > 0 && (
        <Section tone="muted" labelledBy="workflow-title">
          <SectionHeading
            id="workflow-title"
            eyebrow="How it works"
            title="From first inquiry to settled commission"
            intro="A typical journey through the system, from lead capture to broker payout."
          />
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {product.workflow.map((w) => (
              <li key={w.step} className="relative rounded-card border border-line bg-surface p-6">
                <span aria-hidden className="font-mono text-3xl font-bold text-product/20">
                  {w.step}
                </span>
                <h3 className="mt-2 text-lg font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm text-pretty text-ink-muted">{w.description}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Capabilities */}
      <Section tone="muted" labelledBy="capabilities-title">
        <SectionHeading
          id="capabilities-title"
          eyebrow="Capabilities"
          title="What it covers"
          intro="Drawn from the product documentation. Maturity varies by area; see the known gaps below."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {product.capabilities.map((c, i) => (
            <article
              key={c.title}
              className="rounded-card border border-line bg-surface p-6 sm:p-8"
            >
              <span aria-hidden className="font-mono text-sm text-product">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">{c.title}</h3>
              <p className="mt-2 text-ink-muted">{c.summary}</p>
              <ul className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
                {c.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-product" />
                    <span className="text-pretty">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      {/* Tech stack */}
      {product.techStack && product.techStack.length > 0 && (
        <Section labelledBy="stack-title">
          <SectionHeading
            id="stack-title"
            eyebrow="Tech stack"
            title="What it is built with"
            intro="Open, well-known technologies you can hire for and operate yourself."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.techStack.map((t) => (
              <li
                key={t.name}
                className="flex items-center gap-4 rounded-card border border-line bg-surface p-5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-product/10 font-mono text-sm font-bold text-product">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-ink-muted">{t.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Deployment and licence */}
      {product.deployment && (
        <Section labelledBy="deploy-title">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                id="deploy-title"
                eyebrow="Deployment and licence"
                title="Yours to host, inspect and change"
              />
              <div className="mt-6 space-y-4 text-pretty text-ink-muted">
                {product.deployment.paragraphs.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
            </div>
            <figure className="self-start overflow-hidden rounded-card border border-line-strong">
              <figcaption className="border-b border-line-strong bg-surface-muted px-4 py-2 text-sm font-medium">
                {product.deployment.commandCaption}
              </figcaption>
              <pre
                tabIndex={0}
                aria-label="Install commands"
                className="overflow-x-auto bg-ink p-4 font-mono text-sm leading-relaxed text-canvas"
              >
                <code>{product.deployment.command}</code>
              </pre>
              <p className="border-t border-line-strong bg-surface px-4 py-3 text-sm text-ink-muted">
                Run the prerequisite steps in the installation guide first.
              </p>
            </figure>
          </div>
        </Section>
      )}

      {/* Limitations */}
      <Section tone="muted" labelledBy="gaps-title">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <SectionHeading id="gaps-title" eyebrow="Maturity" title="Known gaps, stated plainly" />
            <p className="mt-4 text-pretty text-ink-muted">
              {product.name} {product.version} is a pre-1.0 release, built for a first pilot. It has
              not been independently audited or certified. Read these before relying on it.
            </p>
            <p className="mt-3 text-sm text-ink-muted">
              Last checked against the {product.name} repository on {reviewed}. The repository is
              the source of truth if this page has fallen behind.
            </p>
          </div>
          <ul className="space-y-3">
            {product.limitations.map((l) => (
              <li key={l} className="rounded-card border border-line bg-surface p-5 text-pretty">
                {l}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Links */}
      <Section labelledBy="resources-title">
        <SectionHeading id="resources-title" eyebrow="Resources" title="Documentation and source" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Source repository', links.repo],
            ['Features and usage guide', links.docs],
            ['Installation guide', links.install],
            ['Changelog', links.changelog],
            ['Security policy', links.security],
            ['Issue tracker', links.issues],
          ]
            .filter((l): l is [string, string] => Boolean(l[1]))
            .map(([label, href]) => (
              <li key={label} className="rounded-card border border-line bg-surface p-5">
                <TextLink href={href}>{label}</TextLink>
              </li>
            ))}
        </ul>
      </Section>

      {/* FAQ */}
      {product.faq && product.faq.length > 0 && (
        <Section tone="muted" labelledBy="faq-title">
          <SectionHeading
            id="faq-title"
            eyebrow="FAQ"
            title="Frequently asked questions"
            intro="Common questions about OpenEstate, answered plainly."
          />
          <FaqAccordion items={product.faq} />
        </Section>
      )}

      {/* CTA banner */}
      <Section labelledBy="cta-title">
        <div className="rounded-card border border-product/30 bg-product/5 p-8 sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div className="max-w-2xl">
            <h2 id="cta-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to try {product.name}?
            </h2>
            <p className="mt-3 text-lg text-pretty text-ink-muted">
              It is free, open source, and yours to host. Clone the repository, follow the
              installation guide, and have a running system in under an hour.
            </p>
          </div>
          <div className="mt-8 flex shrink-0 flex-col gap-3 sm:flex-row lg:mt-0">
            {links.install && <ButtonLink href={links.install}>Get started</ButtonLink>}
            {links.repo && (
              <ButtonLink href={links.repo} variant="secondary">
                View source
              </ButtonLink>
            )}
          </div>
        </div>
      </Section>
    </ProductAccent>
  );
}
