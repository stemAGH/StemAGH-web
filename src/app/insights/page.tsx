import type { Metadata } from 'next';
import Link from 'next/link';
import { buyerGuides } from '@/content/buyer-guides';
import { outagePost as post } from '@/content/outage-post';
import { openGraph } from '@/content/seo';
import './insights.css';
const description =
  'Website redesign costs, a real estate CRM evaluation checklist and first-hand project notes from StemAGH.';
export const metadata: Metadata = {
  title: 'Insights',
  description,
  openGraph: openGraph('Insights | StemAGH', description, '/insights'),
};
export default function Insights() {
  return (
    <div className="insight-article">
      <header className="insight-header">
        <div className="insight-wrap">
          <p className="insight-eyebrow">STEMAGH / INSIGHTS</p>
          <h1>Website and CRM buyer guides</h1>
          <p className="insight-deck">
            Plan a redesign, evaluate CRM software and explore the work behind our own website.
          </p>
        </div>
      </header>
      <section className="insight-wrap insight-body">
        {buyerGuides.map((guide) => (
          <section key={guide.slug}>
            <h2>
              <Link href={`/insights/${guide.slug}`}>{guide.title}</Link>
            </h2>
            <p>{guide.description}</p>
          </section>
        ))}
        <div className="mt-12" />
        <p className="insight-eyebrow">OPINION · NOVEMBER 14, 2026</p>
        <h2>
          <Link href={`/insights/${post.slug}`}>{post.title} ↗</Link>
        </h2>
        <p>{post.description}</p>
        <Link className="studio-button" href={`/insights/${post.slug}`}>
          Read the post →
        </Link>
      </section>
    </div>
  );
}
