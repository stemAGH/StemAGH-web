import { siteUrl } from '@/content/seo';
import { services } from '@/content/services';

export const dynamic = 'force-static';
export function GET() {
  const base = siteUrl ?? '';
  const text = `# StemAGH

> StemAGH builds business websites, web applications and custom software. OpenEstate is its open-source real estate operations product.

## Services
${services.map((s) => `- [${s.name}](${base}/services#${s.slug}): ${s.description}`).join('\n')}

## Main pages
- [Services](${base}/services): Deliverables, project process, ownership and hosting terms.
- [OpenEstate](${base}/products/openestate): Current capabilities, limitations, AGPL-3.0 licence and self-hosting requirements.
- [Products](${base}/products): Product portfolio.
- [About](${base}/about): About StemAGH and its approach.
- [Contact](${base}/contact): Project enquiries and public support channels.

## Important details
- Scope, deliverables, milestones and costs are agreed before development starts.
- Hosting setup is included with website projects. Hosting subscriptions, domains, email and maintenance are quoted separately.
- Domain and hosting accounts remain under client control.
- The project brief prepares an email; it does not submit or store an enquiry automatically.
- Product screenshots shown as illustrations are not customer results.
- Contact: contact@stemagh.com

This summary is supplemental. Consult the linked pages for current product capabilities and service terms.
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
