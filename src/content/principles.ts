/** Shared by the homepage and /about. `evidence` describes OpenEstate today, not other products. */
export const principles = [
  {
    title: 'Start from the workflow',
    body: 'We model how a business actually operates before deciding what to build.',
    evidence:
      'It follows Indian real-estate practice: payment plans, GST and TDS, RERA fields and broker commissions.',
  },
  {
    title: 'Keep it maintainable',
    body: 'Business rules belong in configuration, and extension belongs in plugins, so the core stays small.',
    evidence:
      'It keeps tax rates, charge types and letter templates in admin-managed tables, and extends through plugins and webhooks instead of forks.',
  },
  {
    title: 'Be open about the work',
    body: 'Where it makes sense, the source, the changelog and the known gaps are public.',
    evidence: 'It is AGPL-3.0 on GitHub, with release notes and a documented list of known gaps.',
  },
  {
    title: 'Treat security as design',
    body: 'Access control, auditability and safe defaults are built in from the start, not added later.',
    evidence:
      'It enforces tenant isolation in the database, uses role-based access and two-factor authentication, and documents its security fixes.',
  },
];
