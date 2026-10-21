import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/json-ld';
import { ScrollExperience } from '@/components/scroll-experience';
import { ServiceSlideshow } from '@/components/service-slideshow';
import { OpenEstateShowcase } from '@/components/openestate-showcase';
import { site } from '@/content/site';
import { openGraph } from '@/content/seo';

export const metadata: Metadata = {
  title: { absolute: 'StemAGH | Websites & software built for your next chapter' },
  description: site.description,
  openGraph: openGraph(
    'StemAGH | Websites & software built for your next chapter',
    site.description,
    '/',
  ),
};
const services = [
  {
    n: '01',
    icon: '↗',
    name: 'Websites that mean business.',
    text: 'A responsive business website with clear service pages, enquiry links and search metadata. Content and page scope agreed in the proposal.',
    tags: ['Business websites', 'Responsive design', 'Search foundations'],
    type: 'web',
  },
  {
    n: '02',
    icon: '⌘',
    name: 'Software that works your way.',
    text: 'Dashboards, portals and workflow tools built around agreed requirements. Review the interface and working features at defined milestones.',
    tags: ['Web applications', 'Business dashboards', 'Workflow tools'],
    type: 'software',
  },
  {
    n: '03',
    icon: '◎',
    name: 'A smoother path to launch.',
    text: 'Domain connection, deployment checks and account handover. Hosting costs and any ongoing support are agreed separately before launch.',
    tags: ['Hosting setup', 'Deployment', 'Handover'],
    type: 'launch',
  },
];
export default function HomePage() {
  return (
    <div className="studio-home">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: site.name,
          description: site.description,
        }}
      />
      <ScrollExperience />
      <section className="studio-hero" aria-labelledby="hero-title">
        <div className="studio-wrap hero-layout">
          <div className="hero-message">
            <p className="eyebrow">
              <span className="status-dot" /> WEBSITES & CUSTOM SOFTWARE
            </p>
            <h1 id="hero-title">
              Built around
              <br />
              your business.
              <br />
              <span className="hero-highlight">Ready for what’s next.</span>
            </h1>
            <p className="hero-description">
              A website that explains what you do. Software that simplifies how you work. From the
              first brief to launch, we make every step clear.
            </p>
            <div className="hero-actions">
              <Link className="studio-button" href="/contact#project-brief">
                Discuss your project <span>↗</span>
              </Link>
              <a className="studio-text-link" href="#work">
                See OpenEstate <span>↓</span>
              </a>
            </div>
            <p className="hero-assurance">Defined scope. Review milestones. Accounts you own.</p>
          </div>
          <ServiceSlideshow />
        </div>
        <div className="studio-wrap hero-footnote">
          <span>STEMAGH / DESIGN · DEVELOPMENT · DEPLOYMENT</span>
          <a href="#services">EXPLORE WHAT WE BUILD ↓</a>
        </div>
      </section>
      <div className="trust-strip studio-wrap">
        <div>
          <b>01</b>
          <span>
            Clarity before commitment<small>Scope and costs agreed before work starts</small>
          </span>
        </div>
        <div>
          <b>02</b>
          <span>
            Work you can review<small>See progress at agreed milestones</small>
          </span>
        </div>
        <div>
          <b>03</b>
          <span>
            Control after launch<small>Access, accounts and handover documented</small>
          </span>
        </div>
      </div>
      <section
        id="services"
        className="studio-section studio-wrap"
        aria-labelledby="services-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / WHAT WE DO</p>
            <h2 id="services-title">
              A practical build.
              <br />
              <em>A clear deliverable.</em>
            </h2>
          </div>
          <p>
            From your first website to the tool your team uses every day. We build digital
            experiences with a job to do.
          </p>
        </div>
        <div className="service-grid">
          {services.map((s) => (
            <article className="service-card" key={s.n}>
              <div className="service-card-top">
                <span className="service-icon" aria-hidden="true">
                  {s.icon}
                </span>
                <span>{s.n}</span>
              </div>
              <h3>{s.name}</h3>
              <p>{s.text}</p>
              <ul>
                {s.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <Link
                href={`/contact?service=${s.type}`}
                aria-label={`Discuss ${s.name.toLowerCase()}`}
              >
                Let’s talk <span>↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section id="work" className="work-section" aria-labelledby="work-title">
        <div className="studio-wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / FROM OUR WORKSHOP</p>
              <h2 id="work-title">
                Inspect the product.
                <br />
                <em>See how we build.</em>
              </h2>
            </div>
            <p>
              Meet OpenEstate. Our open-source product brings real estate workflows together, from
              the first inquiry to post-sales operations.
            </p>
          </div>
          <div className="work-meta">
            <div>
              <span className="project-mark">OE</span>
              <div>
                <h3>OpenEstate</h3>
                <p>REAL ESTATE OPERATIONS SOFTWARE</p>
              </div>
            </div>
            <span className="project-label">OUR PRODUCT · OPEN SOURCE</span>
          </div>
          <OpenEstateShowcase />
          <div className="work-bottom">
            <div className="work-tags">
              <span>Lead management</span>
              <span>Bookings & collections</span>
              <span>Reporting</span>
            </div>
            <Link href="/products/openestate" className="studio-text-link">
              Explore OpenEstate <span>↗</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="studio-section studio-wrap" aria-labelledby="process-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 / SIMPLE BY DESIGN</p>
            <h2 id="process-title">
              Know what happens
              <br />
              <em>before you start.</em>
            </h2>
          </div>
          <p>You bring the idea. We bring the questions, the craft and a plan you can follow.</p>
        </div>
        <ol className="process-grid">
          {[
            [
              'Let’s understand.',
              'Bring your goals, reference sites and current workflow. We identify requirements, dependencies and the right scope.',
            ],
            [
              'Make a plan.',
              'Review a written scope, deliverables, review milestones, costs and payment terms. Approve the proposal before development starts.',
            ],
            [
              'Build it together.',
              'Review working previews at agreed milestones. Feedback and changes are recorded so everyone knows what comes next.',
            ],
            [
              'Launch with confidence.',
              'Review the agreed deliverables, complete launch checks and receive account access and handover notes. Agree support separately.',
            ],
          ].map(([title, text], i) => (
            <li key={title}>
              <span>
                0{i + 1} <i aria-hidden="true">↗</i>
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
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
              'Business websites, web applications, dashboards and custom workflow tools. Tell us what you need to accomplish and we’ll work out an appropriate scope.',
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
      <section className="studio-cta" aria-labelledby="cta-title">
        <div className="studio-wrap">
          <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
          <h2 id="cta-title">
            Start with a brief.
            <br />
            <em>Leave with a plan.</em>
            <span aria-hidden="true">↗</span>
          </h2>
          <div>
            <p>
              Tell us your goals, timeline and the problem you want to solve.
              <br />
              We’ll discuss feasibility, scope and the next step.
            </p>
            <Link href="/contact#project-brief" className="studio-button">
              Discuss your project <span>↗</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
