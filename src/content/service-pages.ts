import type { serviceLandingEnquiries } from './enquiry';
import type { services } from './services';

type ServicePage = {
  slug: string;
  parent: (typeof services)[number]['slug'];
  title: string;
  heading: string;
  description: string;
  intro: string;
  scope: string[];
  questions: { question: string; answer: string }[];
  action: string;
  enquiry: keyof typeof serviceLandingEnquiries;
  related: { href: string; label: string };
};

export const servicePages = [
  {
    slug: 'business-website-development',
    parent: 'business-websites',
    title: 'Business Website Development in India',
    heading: 'Website development for small businesses in India',
    description:
      'Get a mobile-friendly business website with clear service pages, enquiry forms and search setup. StemAGH builds and launches in accounts you control.',
    intro:
      'Give potential customers somewhere to see what you offer, decide whether it fits their needs and get in touch. StemAGH builds websites for service businesses that need a first site or a clearer way to explain what they do.',
    scope: [
      'Plan the homepage, service pages and contact journey around the questions customers ask before they enquire.',
      'Build mobile-friendly pages with enquiry forms or contact links suited to how you handle new leads.',
      'Set page titles, descriptions and canonical URLs, and include indexable pages in a sitemap.',
      'Connect your domain, check key pages and enquiry flows, and hand over the accounts and agreed deliverables.',
    ],
    questions: [
      {
        question: 'What should I send for a website quote?',
        answer:
          'Share your services, who you sell to and how customers usually contact you. A rough list of pages, available photos or copy, and examples you like help us estimate the scope.',
      },
      {
        question: 'How much does a business website cost?',
        answer:
          'The quote depends on the pages, content, design and integrations you need. We agree the scope and cost before development. Domain registration, hosting subscriptions and ongoing maintenance are quoted separately.',
      },
      {
        question: 'Can I use my existing domain?',
        answer:
          'Yes. Tell us where your domain is registered and whether you use it for business email. We can plan the website connection around your existing setup.',
      },
    ],
    action: 'Request a website quote',
    enquiry: 'website-development',
    related: {
      href: '/services/website-redesign',
      label: 'Already have a site? Explore website redesign',
    },
  },
  {
    slug: 'website-redesign',
    parent: 'business-websites',
    title: 'Website Redesign Services in India',
    heading: 'Website redesign for businesses in India',
    description:
      'Improve an existing business website with clearer service pages, better mobile layouts and a simpler enquiry flow. Plan redirects when URLs need to change.',
    intro:
      'If customers struggle to find your services on a phone or abandon a confusing contact journey, share your current website. We can scope an update around the pages and tasks that need the most work.',
    scope: [
      'Review existing pages, mobile layouts, navigation and contact flows to identify what to keep and improve.',
      'Restructure service information and move important actions within easy reach on mobile.',
      'Keep useful URLs where practical and map permanent redirects to relevant replacement pages when addresses change.',
      'Check links, metadata, the sitemap and enquiry forms before handing over the redesigned site.',
    ],
    questions: [
      {
        question: 'Do I need to replace the entire website?',
        answer:
          'A focused update may be enough if the main problems are on a few pages. Share your URL, what customers struggle with and any technical constraints so we can discuss the right scope.',
      },
      {
        question: 'Can I keep my domain and existing links?',
        answer:
          'We can plan a redesign on your current domain. If page addresses need to change, we identify important existing URLs and map them to relevant replacements before launch.',
      },
      {
        question: 'What helps you assess my current website?',
        answer:
          'Send your website address, priority pages or services, and examples of what is getting in the way of enquiries. If you have Search Console reports, they can help identify pages that already bring in visitors.',
      },
    ],
    action: 'Discuss my website redesign',
    enquiry: 'website-redesign',
    related: {
      href: '/services/business-website-development',
      label: 'Explore new website development',
    },
  },
  {
    slug: 'crm-workflow-automation',
    parent: 'custom-software',
    title: 'Custom CRM & Workflow Automation in India',
    heading: 'Custom CRM and workflow automation for businesses in India',
    description:
      'Build a CRM or workflow tool around lead capture, ownership, follow-ups and reporting. StemAGH scopes custom software and OpenEstate implementations.',
    intro:
      'When leads are spread across forms, spreadsheets and inboxes, it is easy to lose track of who owns the next step. StemAGH builds workflow tools around how your team assigns work, follows up and reviews progress.',
    scope: [
      'Map how a lead arrives, who owns it and what should happen at each stage.',
      'Agree which reminders, assignments and reports are worth automating and which decisions staff should make.',
      'Review which enquiry forms, spreadsheets or other tools need to connect, including their available integrations.',
      'Test representative workflows with the people who will use them and agree the handover and support needs.',
    ],
    questions: [
      {
        question: 'Can we start with one workflow?',
        answer:
          'Yes. A first phase can focus on one repeatable process, such as capturing enquiries and assigning follow-ups. Bring a recent example so we can identify the data, roles and steps needed.',
      },
      {
        question: 'Can you connect our existing tools?',
        answer:
          'Share the tools you use and which information needs to move between them. We review their integration options, access and data formats before committing to a scope.',
      },
      {
        question: 'Is OpenEstate relevant to my team?',
        answer:
          'OpenEstate is our open-source real estate CRM. Review its documented lead, booking and collections workflows if you run a real estate team. We can discuss whether its current features fit your requirements.',
      },
    ],
    action: 'Discuss my CRM workflow',
    enquiry: 'crm-automation',
    related: { href: '/products/openestate', label: 'Explore the OpenEstate real estate CRM' },
  },
] as const satisfies readonly ServicePage[];
