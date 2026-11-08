import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/container';
import { JsonLd } from '@/components/json-ld';
import { ModelList } from '@/components/model-list';
import { OpenEstateShowcase } from '@/components/openestate-showcase';
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
    title: product.seoTitle ?? product.name,
    description: product.summary,
    openGraph: openGraph(
      `${product.seoTitle ?? product.name} | StemAGH`,
      product.summary,
      `/products/${product.slug}`,
    ),
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
            {product.slug === 'openestate' ? (
              <>
                <ButtonLink href="/contact?service=openestate#project-brief">
                  Discuss OpenEstate for your business
                </ButtonLink>
                <ButtonLink href="#tour-title" variant="secondary">
                  Explore the interface
                </ButtonLink>
              </>
            ) : (
              links.repo && <ButtonLink href={links.repo}>View on GitHub</ButtonLink>
            )}
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

      {product.slug === 'openestate' && (
        <Section labelledBy="benefits-title" tone="muted">
          <SectionHeading
            id="benefits-title"
            eyebrow="Built around your business"
            title="One place for your sales, collections and customer relationships."
            intro="For property developers and channel-sales teams managing enquiries, bookings and payment follow-ups across separate spreadsheets and conversations."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              [
                'Keep the next follow-up visible',
                'Give sales teams a shared lead history, assigned ownership and an overdue queue, so managers can see what needs attention.',
              ],
              [
                'See what is sold and what is available',
                'Bring apartment units, plots and farmhouse inventory into the booking process, with project-specific pricing and charges.',
              ],
              [
                'Understand what is due',
                'Review payment schedules, receipts and collection reports together instead of piecing together a customer’s payment position.',
              ],
              [
                'Give buyers a self-service window',
                'Customers can check payment history, download documents and raise support tickets through a mobile-friendly web portal.',
              ],
              [
                'Keep channel partners informed',
                'Brokers can review their sales, availability and commission position through their own portal.',
              ],
              [
                'Control where your data lives',
                'Run the open-source software on infrastructure you manage. Plan for hosting, backups, upgrades and technical support as part of the rollout.',
              ],
            ].map(([title, body]) => (
              <article
                key={title}
                className="rounded-card border border-line bg-surface p-6 sm:p-8"
              >
                <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-3 leading-7 text-ink-muted">{body}</p>
              </article>
            ))}
          </div>
        </Section>
      )}

      {product.slug === 'openestate' && (
        <section aria-labelledby="tour-title" className="work-section">
          <Container>
            <h2 id="tour-title" className="text-3xl font-semibold tracking-tight">
              A look inside
            </h2>
            <p className="mt-3 mb-8 text-ink-muted">
              Switch between screens. Interface illustration with sample data.
            </p>
            <OpenEstateShowcase />
          </Container>
        </section>
      )}

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

      {product.slug === 'openestate' && (
        <Section labelledBy="pilot-title">
          <SectionHeading
            id="pilot-title"
            eyebrow="A practical first step"
            title="Start with one project. Validate your workflow."
            intro="A focused pilot helps your sales and accounts teams decide whether OpenEstate fits before a wider rollout."
          />
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              [
                '01 · Map your process',
                'Discuss your property types, lead sources, sales roles, payment plans and reporting needs. Identify the integrations and changes you would need.',
              ],
              [
                '02 · Run a sample journey',
                'Use sample data to follow a lead through a booking, payment schedule and receipt. Review the customer and broker experience with your team.',
              ],
              [
                '03 · Agree the rollout',
                'Confirm the scope, hosting, access, data preparation, training and support responsibilities before bringing real operations onto the system.',
              ],
            ].map(([title, body]) => (
              <li key={title} className="rounded-card border border-line p-6">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-ink-muted">{body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 rounded-card border border-line bg-surface p-6 sm:p-8">
            <h3 className="text-2xl font-semibold">Could OpenEstate fit your company?</h3>
            <p className="mt-3 max-w-3xl leading-7 text-ink-muted">
              Tell us how many projects and team members you have, what you use today, and which
              part of your process is hardest to manage. We can discuss a pilot, configuration or
              customisation scope with you.
            </p>
            <div className="mt-6">
              <ButtonLink href="/contact?service=openestate#project-brief">
                Discuss an OpenEstate implementation
              </ButtonLink>
            </div>
            <p className="mt-4 text-sm text-ink-muted">
              Open-source software; hosting, implementation, customisation and ongoing support are
              separate considerations. Any paid work is scoped and quoted before it begins.
            </p>
          </div>
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
            ['Installation guide on GitHub', links.installSource],
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
    </ProductAccent>
  );
}
