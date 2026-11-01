import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/content/site';
import { openGraph } from '@/content/seo';
import './home.css';

export const metadata: Metadata = {
  title: { absolute: 'Website, App & Custom Software Development in India | StemAGH' },
  description: site.description,
  openGraph: openGraph(
    'Website, App & Custom Software Development in India | StemAGH',
    site.description,
    '/',
  ),
};

const services = [
  {
    icon: '◧',
    name: 'Business websites',
    text: 'Fast, mobile-first sites that explain what you do and turn visitors into enquiries.',
    href: '/contact?service=web#project-brief',
  },
  {
    icon: '▦',
    name: 'Web & mobile apps',
    text: 'Customer portals, owner apps and dashboards your users open every day.',
    href: '/contact?service=app#project-brief',
  },
  {
    icon: '⚙',
    name: 'Custom software',
    text: 'Workflow tools built around how your team actually works, not a template.',
    href: '/contact?service=software#project-brief',
  },
];

const steps = [
  ['Understand', 'Your goals, users and current workflow.'],
  ['Plan', 'Written scope, milestones and agreed costs.'],
  ['Build', 'Working previews you review as we go.'],
  ['Launch', 'Live in accounts you own, with handover.'],
];

export default function HomePage() {
  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="home-wrap home-hero-grid">
          <div>
            <p className="home-kicker">
              Websites · Apps · Custom software · Chennai &amp; Gurugram
            </p>
            <h1 id="hero-title">
              Software built around <span>your business.</span>
            </h1>
            <p className="home-lead">
              We design and build websites, apps and business tools. Scope, milestones and costs are
              agreed with you before any work starts.
            </p>
            <div className="home-actions">
              <Link className="home-btn" href="/contact#project-brief">
                Start a project <span aria-hidden="true">→</span>
              </Link>
              <Link className="home-btn home-btn-ghost" href="/work">
                Try a live demo
              </Link>
            </div>
            <ul className="home-proof">
              <li>Scope and cost agreed first</li>
              <li>Progress you can review</li>
              <li>Accounts you own</li>
            </ul>
          </div>
          <div className="home-hero-visual" aria-hidden="true">
            <div className="home-phone">
              <Image
                src="/demos/aurelia/images/willow-creek.webp"
                alt=""
                width={1080}
                height={720}
                sizes="260px"
                priority
              />
              <div className="home-phone-card">
                <small>Estimated portfolio value</small>
                <strong>₹4,42,50,000</strong>
                <span>3 properties · Updated today</span>
              </div>
            </div>
            <div className="home-float home-float-a">
              <b>Live demo</b>
              <span>Tap through a real owner app</span>
            </div>
            <div className="home-float home-float-b">
              <b>2</b>
              <span>Open inquiries</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="services-title" id="services">
        <div className="home-wrap">
          <div className="home-head">
            <h2 id="services-title">What we build</h2>
            <Link href="/services">Services and terms →</Link>
          </div>
          <ul className="home-cards">
            {services.map((s) => (
              <li key={s.name}>
                <span className="home-icon" aria-hidden="true">
                  {s.icon}
                </span>
                <h3>{s.name}</h3>
                <p>{s.text}</p>
                <Link href={s.href}>
                  Let’s talk<span className="sr-only"> about {s.name.toLowerCase()}</span>{' '}
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section home-section-tint" aria-labelledby="work-title" id="work">
        <div className="home-wrap">
          <div className="home-head">
            <h2 id="work-title">Our work</h2>
            <Link href="/work">All work →</Link>
          </div>
          <div className="home-work">
            <Link href="/work" className="home-work-card">
              <div className="home-work-media">
                <Image
                  src="/demos/aurelia/images/solstice-grove.webp"
                  alt=""
                  width={1080}
                  height={720}
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
                <span className="home-badge">Live demo</span>
              </div>
              <div className="home-work-body">
                <small>Mobile app · Real estate</small>
                <h3>Aurelia Estates owner app</h3>
                <p>Holdings, project pages, QR visitor passes and owner support in one app.</p>
                <span className="home-more">Try it now →</span>
              </div>
            </Link>
            <Link href="/products/openestate" className="home-work-card">
              <div className="home-work-media home-oe">
                <div className="home-oe-panel" aria-hidden="true">
                  <b>Dashboard</b>
                  <div>
                    <span>
                      <i>2</i>Open inquiries
                    </span>
                    <span>
                      <i>0</i>Overdue
                    </span>
                    <span>
                      <i>₹</i>Collections
                    </span>
                  </div>
                </div>
                <span className="home-badge">Open source</span>
              </div>
              <div className="home-work-body">
                <small>Web application · Our product</small>
                <h3>OpenEstate</h3>
                <p>Real estate operations: leads, inventory, bookings, collections and portals.</p>
                <span className="home-more">Explore the product →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="process-title">
        <div className="home-wrap">
          <div className="home-head">
            <h2 id="process-title">How we work</h2>
          </div>
          <ol className="home-steps">
            {steps.map(([t, d], i) => (
              <li key={t}>
                <span>0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-cta" aria-labelledby="cta-title">
        <div className="home-wrap">
          <div>
            <h2 id="cta-title">Have a project in mind?</h2>
            <p>Send a short brief. We’ll reply with questions, a scope and a plan.</p>
          </div>
          <Link className="home-btn" href="/contact#project-brief">
            Discuss your project <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
