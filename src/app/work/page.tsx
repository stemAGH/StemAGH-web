import type { Metadata } from 'next';
import Link from 'next/link';
import { AppDemo } from '@/components/app-demo';
import { openGraph } from '@/content/seo';

const title = 'Our work and live demos';
const description =
  'Try apps StemAGH has built: an interactive preview of a phone app for a property developer’s owners, and OpenEstate, our open-source real estate operations software.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: openGraph(`${title} | StemAGH`, description, '/work'),
};

const built = [
  [
    'A real phone app',
    'Built for owners to keep on their phones. This preview runs its screens in your browser.',
  ],
  ['Six project pages', 'Search, filters, sorting, saved projects and visit preferences.'],
  ['QR visitor passes', 'Issue a pass, download its QR code, then scan it with the camera.'],
  ['Owner care', 'Support requests, read receipts, community updates and a guided assistant.'],
  ['Monthly photo journals', 'Construction progress shared with owners every month.'],
  [
    'Maintenance subscriptions',
    'Monthly plans, invoices, overdue dues and downloadable receipts. Payments in the demo are simulated.',
  ],
];

export default function WorkPage() {
  return (
    <div className="studio-home">
      <section className="studio-section studio-wrap" aria-labelledby="work-page-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">STEMAGH / WORK</p>
            <h1 id="work-page-title" className="work-page-title">
              Real software.
              <br />
              <em>Try it yourself.</em>
            </h1>
          </div>
          <p>
            Live, clickable software, not screenshots. Tap through the app below exactly as its
            users would.
          </p>
        </div>
        <AppDemo heading="h2" />
      </section>

      <section className="work-section" aria-labelledby="built-title">
        <div className="studio-wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">WHAT’S INSIDE</p>
              <h2 id="built-title">
                One app.
                <br />
                <em>Everything an owner needs.</em>
              </h2>
            </div>
            <p>
              A phone app designed for residential developers, to keep plot owners informed between
              site visits. Records in this demo are illustrative.
            </p>
          </div>
          <ul className="feature-grid">
            {built.map(([t, d]) => (
              <li key={t}>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="studio-section studio-wrap" aria-labelledby="oe-title">
        <div className="work-callout">
          <div>
            <p className="eyebrow">ALSO FROM OUR WORKSHOP</p>
            <h2 id="oe-title">OpenEstate</h2>
            <p>
              Open-source real estate operations software: lead management, inventory, bookings,
              collections, customer and broker portals. Self-hosted, AGPL-3.0.
            </p>
          </div>
          <Link href="/products/openestate" className="studio-button">
            Explore OpenEstate <span>↗</span>
          </Link>
        </div>
      </section>

      <section className="studio-cta" aria-labelledby="work-cta-title">
        <div className="studio-wrap">
          <p className="eyebrow">WANT ONE LIKE THIS?</p>
          <h2 id="work-cta-title">
            Your app,
            <br />
            <em>built around your customers.</em>
          </h2>
          <div>
            <p>Tell us who it’s for and what it should do. We’ll come back with a plan.</p>
            <Link href="/contact?service=app#project-brief" className="studio-button">
              Discuss your app <span>↗</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
