import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/container';
import { JsonLd } from '@/components/json-ld';
import { ButtonLink, TextLink } from '@/components/links';
import { Section } from '@/components/section';
import { openGraph, siteUrl } from '@/content/seo';
import { servicePages } from '@/content/service-pages';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return servicePages.map(({ slug }) => ({ slug }));
}

async function getServicePage(params: Props['params']) {
  const { slug } = await params;
  const service = servicePages.find((page) => page.slug === slug);
  if (!service) notFound();
  return service;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServicePage(params);
  const path = `/services/${service.slug}`;
  return {
    title: service.title,
    description: service.description,
    openGraph: openGraph(`${service.title} | StemAGH`, service.description, path),
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const service = await getServicePage(params);
  const url = `${siteUrl}/services/${service.slug}`;
  const contact = `/contact?service=${service.enquiry}#project-brief`;

  return (
    <>
      {siteUrl && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Service',
                '@id': `${url}#service`,
                url,
                name: service.heading,
                description: service.description,
                provider: { '@id': `${siteUrl}/#organization` },
                areaServed: { '@type': 'Country', name: 'India' },
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Services',
                    item: `${siteUrl}/services`,
                  },
                  { '@type': 'ListItem', position: 3, name: service.title, item: url },
                ],
              },
            ],
          }}
        />
      )}
      <section aria-labelledby="service-title" className="border-b border-line bg-surface">
        <Container className="py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-muted">
            <Link className="underline underline-offset-4" href="/">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <Link className="underline underline-offset-4" href="/services">
              Services
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{service.title}</span>
          </nav>
          <h1
            id="service-title"
            className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
          >
            {service.heading}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-muted">{service.intro}</p>
          <ButtonLink href={contact} className="mt-7">
            {service.action}
          </ButtonLink>
        </Container>
      </section>
      <Section labelledBy="service-scope">
        <div className="max-w-3xl">
          <h2 id="service-scope" className="text-2xl font-semibold tracking-tight">
            What we scope with you
          </h2>
          <ul className="mt-5 list-disc space-y-3 pl-6 leading-7 text-ink-muted">
            {service.scope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Section>
      <Section tone="muted" labelledBy="service-questions">
        <div className="max-w-3xl">
          <h2 id="service-questions" className="text-2xl font-semibold tracking-tight">
            Common questions
          </h2>
          <div className="mt-7 grid gap-7">
            {service.questions.map(({ question, answer }) => (
              <div key={question}>
                <h3 className="text-lg font-semibold">{question}</h3>
                <p className="mt-2 leading-7 text-ink-muted">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
          <ButtonLink href={contact}>{service.action}</ButtonLink>
          {service.slug === 'website-redesign' && (
            <TextLink href="/insights/website-redesign-cost-india">
              Compare website redesign costs
            </TextLink>
          )}
          {service.slug === 'business-website-development' && (
            <TextLink href="/insights/stemagh-website-redesign">
              See how we built our own enquiry journey
            </TextLink>
          )}
          {service.slug === 'crm-workflow-automation' && (
            <TextLink href="/insights/real-estate-crm-evaluation-checklist">
              Evaluate a real estate CRM
            </TextLink>
          )}
          <TextLink href={service.related.href}>{service.related.label}</TextLink>
        </div>
      </Section>
    </>
  );
}
