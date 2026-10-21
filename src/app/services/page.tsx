import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/json-ld';
import { openGraph, siteUrl } from '@/content/seo';
import { services } from '@/content/services';
const title = 'Website Development & Custom Software Services';
const description =
  'Explore StemAGH’s business website development, web applications, custom software and hosting setup. Review deliverables, ownership and the project process.';
export const metadata: Metadata = {
  title,
  description,
  openGraph: openGraph(`${title} | StemAGH`, description, '/services'),
};
export default function ServicesPage() {
  return (
    <div className="studio-home">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'StemAGH development services',
          itemListElement: services.map((service, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Service',
              name: service.name,
              description: service.description,
              ...(siteUrl && {
                '@id': `${siteUrl}/services#${service.slug}`,
                url: `${siteUrl}/services#${service.slug}`,
                provider: { '@id': `${siteUrl}/#organization` },
              }),
            },
          })),
        }}
      />
      <section className="studio-section studio-wrap">
        <p className="eyebrow">STEMAGH / SERVICES</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Website development and custom software for your business.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-muted">
          We design and build business websites, web applications and workflow tools. Every project
          starts with an agreed scope, review milestones and costs before development begins.
        </p>
        <div className="service-grid mt-10">
          {services.map((service) => (
            <article id={service.slug} key={service.slug} className="service-card">
              <h2 className="text-2xl!">{service.name}</h2>
              <p>{service.description}</p>
              <h3 className="mt-6! text-base!">What we scope with you</h3>
              <ul>
                {service.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <section className="mt-14 max-w-3xl">
          <h2>What happens after you enquire?</h2>
          <p className="mt-5 leading-8 text-ink-muted">
            Share your goals, current website or workflow, required features and preferred timeline.
            We discuss feasibility, then prepare a written proposal covering deliverables, review
            milestones, costs and payment terms. Work begins after the proposal is agreed.
          </p>
          <h2 className="mt-10">Who owns the accounts?</h2>
          <p className="mt-5 leading-8 text-ink-muted">
            Your domain and hosting remain in accounts you control. Account access and handover are
            documented. Hosting setup is included with website projects; hosting subscriptions,
            domains, email and ongoing maintenance are quoted separately.
          </p>
          <h2 className="mt-10">See a product we build</h2>
          <p className="mt-5 leading-8 text-ink-muted">
            <Link className="underline" href="/products/openestate">
              OpenEstate
            </Link>{' '}
            is our open-source real estate operations product. Its product page documents the
            current features, self-hosting requirements, AGPL-3.0 licence and known limitations.
          </p>
          <Link className="studio-button mt-8" href="/contact#project-brief">
            Discuss your project ↗
          </Link>
        </section>
      </section>
    </div>
  );
}
