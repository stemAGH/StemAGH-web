/**
 * Single source of truth for the product portfolio. The homepage, /products and
 * /products/[slug] all read from here. Add a product by adding one entry.
 *
 * Every OpenEstate statement below was checked against the public repository
 * (README, docs/docs/features-and-usage.md, LICENSE) at v0.8.4. Re-check the
 * version, requirements and known gaps whenever OpenEstate ships a release.
 */

export type ProductStatus = 'available' | 'in-development' | 'planned';
export type DeliveryModel = 'open-source' | 'self-hosted' | 'saas' | 'commercial';

export type Capability = { title: string; summary: string; items: string[] };

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  status: ProductStatus;
  /** Plain-language maturity note shown next to the status. */
  statusNote?: string;
  version?: string;
  /** ISO date this entry was last checked against the product repository. Update with every review (docs/launch.md). */
  reviewedOn: string;
  category: string;
  audience: string[];
  license?: string;
  model: DeliveryModel[];
  /** Three or four outcomes for cards and the homepage feature band. */
  highlights: { title: string; body: string }[];
  /** Full grouped capabilities for the product page. */
  capabilities: Capability[];
  deployment?: { paragraphs: string[]; commandCaption: string; command: string };
  /** Documented gaps only. Remove an entry when the product docs say it is fixed. */
  limitations: string[];
  links: {
    repo?: string;
    docs?: string;
    install?: string;
    changelog?: string;
    security?: string;
    issues?: string;
    newIssue?: string;
    contributing?: string;
    /** Private vulnerability reporting. Never the public issue tracker. */
    securityReport?: string;
    license?: string;
  };
  /** Product identity colour (hex). Corporate chrome stays StemAGH indigo; only product-owned details use this. */
  accent: string;
  featured?: boolean;
};

export const statusLabels: Record<ProductStatus, string> = {
  available: 'Available',
  'in-development': 'In development',
  planned: 'Planned',
};

export const modelLabels: Record<DeliveryModel, string> = {
  'open-source': 'Open source',
  'self-hosted': 'Self-hosted',
  saas: 'SaaS',
  commercial: 'Commercial',
};

const REPO = 'https://github.com/stemAGH/openestate';
const DOCS = `${REPO}/blob/master/docs/docs`;

export const products: Product[] = [
  {
    slug: 'openestate',
    name: 'OpenEstate',
    tagline: 'An open-source CRM for real-estate sales, from first inquiry to final installment.',
    summary:
      'Pre-sales lead management, inventory, bookings, payment ledgers, broker commissions and customer and broker portals in one self-hosted system, built around Indian real-estate practice.',
    status: 'available',
    statusNote: 'Pre-1.0 release, suited to a first pilot',
    version: 'v0.8.4',
    reviewedOn: '2026-10-17',
    category: 'Real-estate sales and operations',
    audience: [
      'Real-estate developers',
      'Channel-sales and broker-network teams',
      'Teams currently running leads and collections in spreadsheets',
    ],
    license: 'AGPL-3.0',
    model: ['open-source', 'self-hosted'],
    highlights: [
      {
        title: 'From inquiry to booking',
        body: 'Capture leads from several channels, avoid duplicates, assign them across the team and follow up through a configurable pipeline.',
      },
      {
        title: 'Inventory that fits the project',
        body: 'Towers and units, or plotted and farmhouse land priced per acre or guntha, in the same booking flow.',
      },
      {
        title: 'A ledger that reconciles',
        body: 'Payment plans, receipts and GST and TDS handling on an append-only ledger. Corrections are reversals, never edits.',
      },
      {
        title: 'Brokers and buyers included',
        body: 'Commission rules and statements for brokers, plus mobile-friendly portals for customers and channel partners.',
      },
    ],
    capabilities: [
      {
        title: 'Pre-sales',
        summary: 'Turn inquiries into bookings without losing track of anyone.',
        items: [
          'Lead capture from walk-ins, calls, your website and property portals through an inbound lead API',
          'Duplicate detection that links repeat inquiries to the existing person',
          'Admin-defined lead stages with a stage history for every lead',
          'Round-robin or manual assignment, with visibility that follows the manager hierarchy',
          'Follow-up timeline, site visits and an overdue queue',
          'Reports for funnel, source conversion and staff performance, filterable by date and project',
        ],
      },
      {
        title: 'Inventory',
        summary: 'Model the project the way it is actually sold.',
        items: [
          'Projects, towers, floors and units with rate revisions',
          'Plotted, farmhouse and villa land, priced per acre or guntha',
          'Optional Sector, Block or Cluster grouping for browsing',
          'Preferential-location charges and other unit-level pricing',
        ],
      },
      {
        title: 'Bookings and collections',
        summary: 'The financial core, designed so the numbers can be audited.',
        items: [
          'Booking wizard with co-applicants, cost breakup and payment plan',
          'Generated installment schedules and oldest-dues-first receipt allocation',
          'Cheque lifecycle tracking, including bounces',
          'CGST, SGST and IGST split by property location, plus Section 194-IA TDS tracking',
          'Transfers, cancellations and refunds on an append-only ledger',
          'Allotment letters, demand letters, receipts and statements as PDFs',
        ],
      },
      {
        title: 'Brokers and commissions',
        summary: 'Run a channel-partner network with clear accounting.',
        items: [
          'Broker registry with RERA agent numbers and bank details',
          'Flat or slab-based commission rules, accrued on booking or on collection',
          'Section 194-H TDS on commission',
          'Clawback when a booking is cancelled, and downloadable broker statements',
        ],
      },
      {
        title: 'Customer and broker portals',
        summary: 'Let buyers and partners help themselves.',
        items: [
          'Customers see their unit, payment schedule, history, documents and construction updates',
          'Customers raise support tickets and request profile changes for staff approval',
          'Brokers see their sales, commission position and live availability',
          'Brokers can approve or reject a cancellation NOC',
        ],
      },
      {
        title: 'Adapt it without forking',
        summary: 'Configuration and extension points are part of the core.',
        items: [
          'Custom fields on applicants, inquiries and projects',
          'Terminology overrides, so a "Unit" can be relabelled for another industry',
          'Module flags, plugins and webhooks',
          'Role-based access control and two-factor authentication',
        ],
      },
    ],
    deployment: {
      paragraphs: [
        'OpenEstate is licensed under AGPL-3.0. You install it natively on your own Linux server, with a PostgreSQL, Redis and nginx that you run and back up yourself. It does not depend on a mandatory external service.',
        'The installer is verified on Ubuntu 25.10. Ubuntu 24.04 is the documented target but has not been independently re-verified. Other distributions are untested. It needs Node.js 20.',
        'In plain terms, AGPL-3.0 asks you to offer the source of a modified version to people who use it over a network. This is a summary, not legal advice: read the licence before offering a modified copy as a service.',
      ],
      commandCaption: 'Install, from the project README',
      command: `sudo git clone https://github.com/stemAGH/openestate.git \\
  /opt/openestate-src
cd /opt/openestate-src/deploy/native
sudo ./install-native.sh \\
  --server-name crm.yourcompany.com`,
    },
    limitations: [
      'There is no hosted demo yet. The documentation says one is coming; today you install it on your own server.',
      'Interest on delayed payments is calculated by the system, but it cannot yet be switched on for a booking from the app, so no interest is charged.',
      'A custom field can be defined on a unit but there is no screen to fill it in.',
      'The audit log is incomplete: updates record new values only, and some bulk changes are not recorded.',
    ],
    links: {
      repo: REPO,
      docs: `${DOCS}/features-and-usage.md`,
      install: `${DOCS}/installation.md`,
      changelog: `${REPO}/blob/master/CHANGELOG.md`,
      security: `${REPO}/blob/master/SECURITY.md`,
      issues: `${REPO}/issues`,
      newIssue: `${REPO}/issues/new/choose`,
      contributing: `${REPO}/blob/master/CONTRIBUTING.md`,
      securityReport: `${REPO}/security/advisories/new`,
      license: `${REPO}/blob/master/LICENSE`,
    },
    // OpenEstate's own brand teal, taken from its project site. Passes AA on white and surface-muted.
    accent: '#0f766e',
    featured: true,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

const featured = products.find((p) => p.featured) ?? products[0];
if (!featured) throw new Error('src/content/products.ts must define at least one product');
export const featuredProduct: Product = featured;
