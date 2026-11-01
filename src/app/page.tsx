import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/content/site';
import { openGraph } from '@/content/seo';
import { Phone } from '@/components/phone';
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

const commitments = [
  ['Before we start', 'Written scope, milestones and an agreed cost.'],
  ['Every week', 'A working preview you can click through.'],
  ['At launch', 'Code, domain and hosting in your name.'],
  ['After launch', 'Support and updates when you need them.'],
];

const steps = [
  ['Understand', 'Your goals, users and current workflow.'],
  ['Plan', 'Written scope, milestones and agreed costs.'],
  ['Build', 'Working previews you review as we go.'],
  ['Launch', 'Live in accounts you own, with handover.'],
];

const stack = [
  'Next.js',
  'React',
  'TypeScript',
  'Node.js',
  'NestJS',
  'PostgreSQL',
  'Redis',
  'Tailwind CSS',
  'Vercel',
  'Playwright',
];

export default function HomePage() {
  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="home-orb home-orb-a" aria-hidden="true" />
        <div className="home-orb home-orb-b" aria-hidden="true" />
        <div className="home-wrap home-hero-grid">
          <div className="home-hero-copy">
            <p className="home-kicker">
              <span className="home-dot" aria-hidden="true" />
              Websites · Apps · Custom software · Chennai &amp; Gurugram
            </p>
            <h1 id="hero-title">
              Software built around <span>your business.</span>
            </h1>
            <p className="home-lead">
              We design and build websites, phone apps and business tools that people enjoy using.
              Scope, milestones and costs are agreed with you before any work starts.
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
            <Phone className="home-phone-back" screens={['projects']} />
            <Phone
              className="home-phone-front"
              screens={['home', 'support', 'referral']}
              priority
            />
            <div className="home-chip home-chip-a">
              <b>Live demo</b>
              <span>Tap through the real app</span>
            </div>
            <div className="home-chip home-chip-b">
              <b>₹4,42,50,000</b>
              <span>Owner portfolio, at a glance</span>
            </div>
          </div>
        </div>

        <div className="home-wrap">
          <ul className="home-commit">
            {commitments.map(([when, what]) => (
              <li key={when}>
                <b>{when}</b>
                <span>{what}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section" aria-labelledby="services-title" id="services">
        <div className="home-wrap">
          <div className="home-head reveal">
            <h2 id="services-title">What we build</h2>
            <Link href="/services">Services and terms →</Link>
          </div>
          <ul className="home-bento">
            <li className="home-tile reveal">
              <div className="home-tile-art home-art-web" aria-hidden="true">
                <div className="home-browser">
                  <i />
                  <b />
                  <p />
                  <p />
                  <span />
                </div>
              </div>
              <h3>Business websites</h3>
              <p>
                Fast, mobile-first sites that explain what you do and turn visitors into enquiries.
              </p>
              <Link href="/contact?service=web#project-brief">
                Let’s talk<span className="sr-only"> about business websites</span>{' '}
                <span aria-hidden="true">→</span>
              </Link>
            </li>
            <li className="home-tile home-tile-feature reveal">
              <div className="home-tile-art home-art-app" aria-hidden="true">
                <Image
                  src="/showcase/aurelia-support.webp"
                  alt=""
                  width={600}
                  height={1298}
                  sizes="220px"
                />
              </div>
              <h3>Web &amp; mobile apps</h3>
              <p>Phone apps, customer portals and dashboards your users open every day.</p>
              <Link href="/contact?service=app#project-brief">
                Let’s talk<span className="sr-only"> about web &amp; mobile apps</span>{' '}
                <span aria-hidden="true">→</span>
              </Link>
            </li>
            <li className="home-tile reveal">
              <div className="home-tile-art home-art-soft" aria-hidden="true">
                <div className="home-dash">
                  <div>
                    <small>Collections</small>
                    <strong>₹18.4L</strong>
                  </div>
                  <div className="home-bars">
                    {[40, 62, 48, 80, 66, 92].map((h, i) => (
                      <i key={i} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
              <h3>Custom software</h3>
              <p>Workflow tools built around how your team actually works, not a template.</p>
              <Link href="/contact?service=software#project-brief">
                Let’s talk<span className="sr-only"> about custom software</span>{' '}
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="home-showcase" aria-labelledby="work-title" id="work">
        <div className="home-wrap">
          <div className="home-head home-head-dark reveal">
            <h2 id="work-title">Our work</h2>
            <Link href="/work">All work →</Link>
          </div>
          <Link href="/work" className="home-feature reveal">
            <div className="home-feature-copy">
              <small>Phone app · Real estate</small>
              <h3>Aurelia Estates owner app</h3>
              <p>
                Holdings and plot values, project pages, QR visitor passes, referrals and owner
                support, in one calm app for a property developer’s customers.
              </p>
              <ul>
                <li>Six project pages with search and filters</li>
                <li>QR visitor passes, scanned at the gate</li>
                <li>Support requests with read receipts</li>
              </ul>
              <span className="home-btn">
                Try the live app <span aria-hidden="true">→</span>
              </span>
            </div>
            <div className="home-fan" aria-hidden="true">
              <Phone className="home-fan-l" screens={['projects']} />
              <Phone className="home-fan-c" screens={['home']} />
              <Phone className="home-fan-r" screens={['referral']} />
            </div>
          </Link>
          <Link href="/products/openestate" className="home-oe reveal">
            <div className="home-oe-copy">
              <small>Web application · Our open-source product</small>
              <h3>OpenEstate</h3>
              <p>
                Real estate operations in one system: leads, inventory, bookings, collections and
                customer and broker portals.
              </p>
              <span className="home-more">Explore the product →</span>
            </div>
            <div className="home-oe-panel" aria-hidden="true">
              <b>Dashboard</b>
              <div>
                <span>
                  <i>24</i>Open inquiries
                </span>
                <span>
                  <i>6</i>Site visits today
                </span>
                <span>
                  <i>₹</i>Collections
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="home-section" aria-labelledby="process-title">
        <div className="home-wrap">
          <div className="home-head reveal">
            <h2 id="process-title">How we work</h2>
          </div>
          <ol className="home-steps">
            {steps.map(([t, d], i) => (
              <li key={t} className="reveal">
                <span>0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-stack" aria-label="Technologies we build with">
        <p>Built with</p>
        <div className="home-marquee">
          <ul>
            {[...stack, ...stack].map((s, i) => (
              <li key={i} aria-hidden={i >= stack.length || undefined}>
                {s}
              </li>
            ))}
          </ul>
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
