export const services = [
  {
    slug: 'business-websites',
    name: 'Business website development',
    description:
      'Responsive business websites that explain your services and make it easy for potential customers to enquire.',
    deliverables: [
      'Agreed page structure and content requirements',
      'Responsive layouts for mobile and desktop',
      'Page titles, descriptions and search metadata',
      'Enquiry links and launch checks',
    ],
  },
  {
    slug: 'custom-software',
    name: 'Web applications and custom software',
    description:
      'Portals, dashboards and workflow tools developed around documented business requirements.',
    deliverables: [
      'Requirements and workflow definition',
      'Interface review before implementation',
      'Working features reviewed at agreed milestones',
      'Validation and handover for the agreed scope',
    ],
  },
  {
    slug: 'hosting-and-launch',
    name: 'Hosting setup and website launch',
    description:
      'Domain connection, deployment checks and handover in hosting accounts controlled by the client.',
    deliverables: [
      'Hosting plan selection for the project’s commercial requirements',
      'Domain connection and deployment configuration',
      'Agreed launch checks',
      'Documented account access and handover',
    ],
  },
] as const;
