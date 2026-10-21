import type { Metadata } from 'next';
import Link from 'next/link';
import { ScrollVideo } from '@/components/scroll-video';
import { scrollVideo } from '@/content/scroll-video';
import { ScrollExperience } from '@/components/scroll-experience';
import { OpenEstateShowcase } from '@/components/openestate-showcase';
import { site } from '@/content/site';
import { openGraph } from '@/content/seo';

export const metadata: Metadata = {
  title: { absolute: 'Website Development & Custom Software | StemAGH' },
  description: site.description,
  openGraph: openGraph('Website Development & Custom Software | StemAGH', site.description, '/'),
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
    <div className="studio-home studio-story">
      <ScrollExperience />
      <section className="studio-hero narrative-hero" aria-labelledby="hero-title">
        <div className="studio-wrap">
          <div className="narrative-kicker">
            <p className="eyebrow">STEMAGH / SOFTWARE · SOLUTIONS · GROWTH</p>
            <span>WEBSITES & CUSTOM SOFTWARE</span>
          </div>
          <h1 id="hero-title">
            Built around
            <br />
            <span>your next move.</span>
          </h1>
          <div className="narrative-intro">
            <p>
              More than a website. Less friction in the way you work. We turn business requirements
              into considered websites and software.
            </p>
            <div>
              <Link className="studio-button" href="/contact#project-brief">
                Discuss your project <span>↗</span>
              </Link>
              <a className="studio-text-link" href="#film-title">
                Follow the build ↓
              </a>
            </div>
          </div>
          <div className="narrative-bottom">
            <span>THE JOURNEY: BRIEF → INTERFACE → WORKING PRODUCT</span>
            <span>SCROLL TO SEE IT TAKE SHAPE ↓</span>
          </div>
        </div>
      </section>
      <ScrollVideo {...scrollVideo} />
      <section
        id="services"
        className="studio-section studio-wrap"
        aria-labelledby="services-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / WHAT NEEDS TO CHANGE?</p>
            <h2 id="services-title">
              Three ways
              <br />
              <em>we move you forward.</em>
            </h2>
          </div>
          <p>
            From your first website to the tool your team uses every day. We build digital
            experiences with a job to do.
          </p>
        </div>
        <p className="mb-6">
          <Link className="studio-text-link" href="/services">
            View service deliverables and project terms ↗
          </Link>
        </p>
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
              <p className="eyebrow">02 / A PRODUCT YOU CAN INSPECT</p>
              <h2 id="work-title">
                Inside
                <br />
                <em>OpenEstate.</em>
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
      <section
        className="studio-section studio-wrap narrative-process"
        aria-labelledby="process-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 / THE WORKING AGREEMENT</p>
            <h2 id="process-title">
              No mystery
              <br />
              <em>between milestones.</em>
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
      <section
        className="hosting-section studio-wrap narrative-ownership"
        aria-labelledby="hosting-title"
      >
        <div className="hosting-art" aria-hidden="true">
          <span>
            THE
            <br />
            HANDOVER.
          </span>
          <i>
            01 &nbsp; YOUR DOMAIN
            <br />
            02 &nbsp; YOUR HOSTING
            <br />
            03 &nbsp; YOUR ACCESS
            <br />
            04 &nbsp; YOUR NEXT CHAPTER
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
