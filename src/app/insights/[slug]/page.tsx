import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { buyerGuides } from '@/content/buyer-guides';
import { openGraph } from '@/content/seo';
import '../insights.css';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return buyerGuides.map(({ slug }) => ({ slug }));
}
async function guideFor({ params }: Props) {
  const { slug } = await params;
  return buyerGuides.find((guide) => guide.slug === slug) ?? notFound();
}
export async function generateMetadata(props: Props): Promise<Metadata> {
  const guide = await guideFor(props);
  return {
    title: guide.title,
    description: guide.description,
    openGraph: openGraph(guide.title + ' | StemAGH', guide.description, '/insights/' + guide.slug),
  };
}
export default async function GuidePage(props: Props) {
  const guide = await guideFor(props);
  return (
    <article className="insight-article">
      <header className="insight-header">
        <div className="insight-wrap">
          <Link className="insight-back" href="/insights">
            All insights
          </Link>
          <h1>{guide.title}</h1>
          <p className="insight-deck">{guide.intro}</p>
        </div>
      </header>
      <div className="insight-wrap insight-body">
        {guide.sections.map(([heading, body], index) => (
          <section key={heading}>
            <h2>{heading}</h2>
            <p>{body}</p>
            {guide.slug === 'real-estate-crm-evaluation-checklist' && index === 2 && (
              <figure className="mt-6">
                <Image
                  src="/work/openestate-instalments.webp"
                  width={685}
                  height={136}
                  sizes="(max-width: 720px) 90vw, 685px"
                  alt="OpenEstate instalment table showing the amount, payment received, outstanding balance and status"
                  className="h-auto max-w-full"
                />
                <figcaption className="mt-3 text-sm text-ink-muted">
                  OpenEstate’s test account shows one paid instalment and one outstanding
                  instalment.{' '}
                  <a href="https://github.com/stemAGH/openestate/blob/21f013e1390e08d326eade0b459e66bd8890db5b/apps/e2e/tests/visual-baseline.spec.ts-snapshots/accounts-installments-1440-win32.png">
                    View the original test screenshot
                  </a>
                  .
                </figcaption>
              </figure>
            )}
            {guide.slug === 'stemagh-website-redesign' && index < 2 && (
              <figure className="mt-6">
                <Image
                  className="h-auto max-w-full rounded-lg border border-line"
                  src={index === 0 ? '/work/services-before.webp' : '/work/services-after.webp'}
                  width={index === 0 ? 314 : 1040}
                  height={index === 0 ? 435 : 489}
                  sizes="(max-width: 840px) 90vw, 800px"
                  alt={
                    index === 0
                      ? 'Earlier service card listing general website development deliverables'
                      : 'Dedicated redesign page with a project-specific enquiry button'
                  }
                />
              </figure>
            )}
          </section>
        ))}
        <nav className="mt-12" aria-label="Related resources">
          <ul>
            {guide.links.map(([href, label]) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </article>
  );
}
