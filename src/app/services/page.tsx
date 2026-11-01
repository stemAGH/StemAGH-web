import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/json-ld';
import { openGraph, siteUrl } from '@/content/seo';
import { services } from '@/content/services';
const title = 'Website Development & Custom Software Services';
const description =
  'Business website development, web and mobile apps, custom software and hosting setup for companies across India. Review deliverables, ownership and the project process.';
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
        </section>
      </section>
      <section className="hosting-section studio-wrap" aria-labelledby="hosting-title">
        <div className="hosting-art" aria-hidden="true">
          <span>↗</span>
          <i>
            YOUR WEBSITE
            <br />
            YOUR ACCOUNT
            <br />
            YOUR CONTROL
          </i>
        </div>
        <div>
          <p className="eyebrow">LESS FRICTION. MORE OWNERSHIP.</p>
          <h2 id="hosting-title">
            Built for you.
            <br />
            Owned by you.
          </h2>
          <p>
            Hosting setup is included with our website projects. We help you select a suitable plan
            and launch in an account you own.
          </p>
          <ul>
            <li>Domain and hosting under your control</li>
            <li>Clear handover and access to your website</li>
            <li>Hosting costs agreed before launch</li>
          </ul>
          <small>
            Hosting subscriptions, domains, email and ongoing maintenance are quoted separately. Any
            recurring costs are agreed before you commit.
          </small>
        </div>
      </section>
      <section className="studio-section studio-wrap faq-section" aria-labelledby="faq-title">
        <div>
          <p className="eyebrow">A FEW THINGS YOU MIGHT ASK</p>
          <h2 id="faq-title">
            Good questions.
            <br />
            <em>Clear answers.</em>
          </h2>
        </div>
        <div className="faq-list">
          {[
            [
              'What can you build for my business?',
              'Business websites, web and mobile apps, dashboards and custom workflow tools. Tell us what you need to accomplish and we’ll work out an appropriate scope.',
            ],
            [
              'How much will my project cost?',
              'Every project starts with a conversation. We provide a proposal covering the agreed scope, deliverables, timeline and costs before work begins.',
            ],
            [
              'Is hosting free?',
              'Hosting setup is included. The hosting plan itself depends on your project and its commercial requirements. We agree any recurring costs with you before launch.',
            ],
            [
              'Can you adapt OpenEstate for our workflow?',
              'We can discuss your requirements and what an implementation would involve. OpenEstate is open source under AGPL-3.0; its current capabilities and limitations are documented on the product page.',
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="studio-section studio-wrap">
        <Link className="studio-button" href="/contact#project-brief">
          Discuss your project ↗
        </Link>
      </section>
    </div>
  );
}
