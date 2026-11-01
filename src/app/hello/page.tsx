import type { Metadata } from 'next';
import Link from 'next/link';
import { AppDemo } from '@/components/app-demo';
import { Phone } from '@/components/phone';
import { ProjectBrief } from '@/components/project-brief';
import { openGraph } from '@/content/seo';
import '../home.css';
import './hello.css';

/*
 * The page linked from cold emails: /hello?name=Ravi&company=Acme%20Realty
 * Both parameters are optional. Personalised and outbound-only, so it stays out of search.
 */
const description =
  'StemAGH builds websites, phone apps and custom software for businesses across India. A two-minute introduction with an app you can try.';

export const metadata: Metadata = {
  title: 'A short introduction',
  description,
  robots: { index: false, follow: true },
  // Email and chat apps show this preview when the link is pasted.
  openGraph: openGraph('A short introduction to StemAGH', description, '/hello'),
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** Visitor-supplied text from the link: one value, no control or angle-bracket characters, short. */
function clean(value: string | string[] | undefined, max: number) {
  const v = Array.isArray(value) ? value[0] : value;
  return (v ?? '')
    .replace(/[\u0000-\u001f\u007f<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

const offers = [
  {
    name: 'A website that wins enquiries',
    points: [
      'Clear on a phone in five seconds',
      'Fast, findable on Google',
      'Enquiries straight to your inbox',
    ],
  },
  {
    name: 'An app your customers keep',
    points: [
      'Phone apps and customer portals',
      'Updates, payments, support in one place',
      'Built around your brand',
    ],
  },
  {
    name: 'Software for how your team works',
    points: [
      'Replace spreadsheets and WhatsApp threads',
      'Dashboards, approvals, reports',
      'Only the features you need',
    ],
  },
];

const terms = [
  ['A free first call', 'Thirty minutes on your goals. No obligation.'],
  ['A written proposal', 'Scope, milestones and an agreed cost before any work starts.'],
  ['Weekly previews', 'Click through working software as it is built.'],
  ['Everything in your name', 'Code, domain and hosting accounts belong to you.'],
];

export default async function HelloPage({ searchParams }: Props) {
  const q = await searchParams;
  const name = clean(q.name, 40);
  const company = clean(q.company, 60);

  return (
    <div className="home pitch">
      <section className="home-hero" aria-labelledby="pitch-title">
        <div className="home-orb home-orb-a" aria-hidden="true" />
        <div className="home-wrap home-hero-grid pitch-hero">
          <div>
            <p className="home-kicker">
              <span className="home-dot" aria-hidden="true" />
              {company ? `Prepared for ${company}` : 'A two-minute introduction'}
            </p>
            {name && <p className="pitch-hi">Hi {name},</p>}
            <h1 id="pitch-title">
              Here’s what we could build for <span>{company || 'your business'}.</span>
            </h1>
            <p className="home-lead">
              StemAGH is a website and software studio in Chennai and Gurugram. In two minutes you
              can see what we make, try one of our apps, and tell us what you need.
            </p>
            <div className="home-actions">
              <Link className="home-btn" href="#project-brief">
                Get a free proposal <span aria-hidden="true">→</span>
              </Link>
              <Link className="home-btn home-btn-ghost" href="#demo">
                Try our app
              </Link>
            </div>
          </div>
          <div className="pitch-visual" aria-hidden="true">
            <Phone screens={['home', 'projects', 'support']} priority />
          </div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="help-title">
        <div className="home-wrap">
          <div className="home-head reveal">
            <h2 id="help-title">Where we can help{company && ` ${company}`}</h2>
          </div>
          <ul className="pitch-offers">
            {offers.map((o, i) => (
              <li key={o.name} className="reveal">
                <span>0{i + 1}</span>
                <h3>{o.name}</h3>
                <ul>
                  {o.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pitch-demo" id="demo" aria-labelledby="demo-title">
        <div className="home-wrap">
          <div className="home-head reveal">
            <h2 id="demo-title">Don’t take our word for it. Try an app we built.</h2>
          </div>
          <AppDemo />
        </div>
      </section>

      <section className="home-showcase pitch-terms" aria-labelledby="terms-title">
        <div className="home-wrap">
          <div className="home-head home-head-dark reveal">
            <h2 id="terms-title">What working with us looks like</h2>
          </div>
          <ol className="pitch-terms-list">
            {terms.map(([t, d]) => (
              <li key={t} className="reveal">
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-section pitch-brief" aria-label="Project brief">
        <div className="home-wrap">
          <ProjectBrief source={company ? `Pitch page (${company})` : 'Pitch page'} />
        </div>
      </section>
    </div>
  );
}
