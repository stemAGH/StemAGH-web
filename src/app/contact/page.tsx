import type { Metadata } from 'next';
import { openGraph } from '@/content/seo';
import { Container } from '@/components/container';
import { TextLink } from '@/components/links';
import { Section } from '@/components/section';
import { featuredProduct } from '@/content/products';
import { site } from '@/content/site';

const description =
  'How to reach StemAGH and the OpenEstate project: questions, bug reports, contributions and private security reports.';

export const metadata: Metadata = {
  title: 'Contact',
  description,
  openGraph: openGraph('Contact | StemAGH', description, '/contact'),
};

const card = 'flex flex-col rounded-card border border-line bg-surface p-6';

export default function ContactPage() {
  const p = featuredProduct;
  const { links } = p;
  const routes = [
    {
      title: 'Questions about using OpenEstate',
      body: 'Start with the installation guide and the features guide. If they do not answer it, ask in the public issue tracker so the answer helps others too.',
      links: [
        ['Installation guide', links.install],
        ['Features and usage guide', links.docs],
        ['Ask in the issue tracker', links.newIssue],
      ],
    },
    {
      title: 'Bugs and feature requests',
      body: 'Open an issue on the public repository. Include the version you run, what you expected and what happened.',
      links: [
        ['Open an issue', links.newIssue],
        ['Browse existing issues', links.issues],
      ],
    },
    {
      title: 'Contributing',
      body: 'Read the contribution guide before opening a pull request. Contributions are licensed under AGPL-3.0.',
      links: [['Contribution guide', links.contributing]],
    },
  ] as const;

  return (
    <>
      <section aria-labelledby="contact-title" className="border-b border-line bg-surface">
        <Container className="py-14 sm:py-20">
          <p className="text-sm font-medium tracking-wide text-accent uppercase">Contact</p>
          <h1
            id="contact-title"
            className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
          >
            Get in touch
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-pretty text-ink-muted">
            Pick the route that fits. Each one below is a real, public channel.
          </p>
        </Container>
      </section>

      <Section labelledBy="general-title">
        <h2 id="general-title" className="text-2xl font-semibold tracking-tight">
          General enquiries
        </h2>
        {site.contactEmail ? (
          <p className="mt-3 text-lg">
            <TextLink href={`mailto:${site.contactEmail}`}>{site.contactEmail}</TextLink>
          </p>
        ) : (
          <p className="mt-3 max-w-2xl text-lg text-pretty text-ink-muted">
            StemAGH has not published a general enquiry address yet, so there is no email to show
            here. It will appear on this page once one is confirmed. Until then, use the OpenEstate
            routes below.
          </p>
        )}
      </Section>

      <Section tone="muted" labelledBy="openestate-title">
        <h2 id="openestate-title" className="text-2xl font-semibold tracking-tight">
          {p.name}
        </h2>
        <ul className="mt-8 grid gap-6 lg:grid-cols-3">
          {routes.map((r) => (
            <li key={r.title} className={card}>
              <h3 className="text-lg font-semibold">{r.title}</h3>
              <p className="mt-2 flex-1 text-pretty text-ink-muted">{r.body}</p>
              <ul className="mt-5 space-y-2">
                {r.links.map(([label, href]) =>
                  href ? (
                    <li key={label}>
                      <TextLink href={href}>{label}</TextLink>
                    </li>
                  ) : null,
                )}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="security-title">
        <div className="max-w-3xl rounded-card border border-accent/40 bg-accent-soft/50 p-6 sm:p-8">
          <h2 id="security-title" className="text-2xl font-semibold tracking-tight">
            Security reports
          </h2>
          <p className="mt-3 text-pretty">
            <strong>Do not open a public issue for a vulnerability.</strong> The {p.name} security
            policy asks for private reports through GitHub&rsquo;s security advisories. That channel
            is the only private route the project documents.
          </p>
          <ul className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-6">
            {links.securityReport && (
              <li>
                <TextLink href={links.securityReport}>Report a vulnerability privately</TextLink>
              </li>
            )}
            {links.security && (
              <li>
                <TextLink href={links.security}>Read the security policy</TextLink>
              </li>
            )}
          </ul>
          <p className="mt-5 text-sm text-ink-muted">
            Reports are for {p.name}. This website has no accounts or stored data.
          </p>
        </div>
      </Section>
    </>
  );
}
