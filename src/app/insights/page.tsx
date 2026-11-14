import type { Metadata } from 'next';
import Link from 'next/link';
import { outagePost as post } from '@/content/outage-post';
import { openGraph } from '@/content/seo';
import './insights.css';
const description =
  'Practical commentary from StemAGH on business software, self-hosting and operational continuity.';
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
          <h1>
            Software decisions.
            <br />
            Business consequences.
          </h1>
          <p className="insight-deck">Practical views on the systems your business depends on.</p>
        </div>
      </header>
      <section className="insight-wrap insight-body">
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
