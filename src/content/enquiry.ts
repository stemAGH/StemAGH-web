/** Project enquiry fields, shared by the form and the /api/contact route. */
export const services = [
  'Business website',
  'Web application',
  'Custom software',
  'Mobile app',
  'OpenEstate implementation',
  'Help defining my project',
] as const;

/** `/contact?service=web` style links from the home page map onto the list above. */
export const serviceFromQuery: Record<string, (typeof services)[number]> = {
  web: 'Business website',
  software: 'Web application',
  launch: 'Business website',
  app: 'Mobile app',
  openestate: 'OpenEstate implementation',
};

export const limits = {
  name: 100,
  email: 254,
  company: 120,
  timeline: 120,
  budget: 60,
  brief: 3000,
};
type Field = keyof typeof limits;

export type Enquiry = Record<Field, string> & { service: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns the cleaned enquiry, or a message for the visitor. */
export function validateEnquiry(input: unknown): Enquiry | string {
  if (!input || typeof input !== 'object') return 'Invalid request.';
  const o = input as Record<string, unknown>;
  const out = {} as Enquiry;
  for (const k of Object.keys(limits) as Field[]) {
    const v = o[k] ?? '';
    if (typeof v !== 'string') return `Invalid ${k}.`;
    const t = v.trim();
    if (t.length > limits[k]) return `The ${k} field is too long.`;
    out[k] = t;
  }
  if (!out.name) return 'Please add your name.';
  if (!EMAIL.test(out.email)) return 'Please add a valid email address.';
  if (out.brief.length < 10) return 'Please tell us a little more about your project.';
  const service = typeof o.service === 'string' ? o.service : '';
  if (!(services as readonly string[]).includes(service)) return 'Please choose a project type.';
  out.service = service;
  return out;
}

export const subjectFor = (e: Enquiry) => `Project enquiry: ${e.service} (${e.name})`;

/** FormSubmit payload: one labelled row per field in the email it sends. */
export const formSubmitFields = (e: Enquiry) => ({
  _subject: subjectFor(e),
  _replyto: e.email,
  _template: 'table',
  _captcha: 'false',
  Name: e.name,
  Email: e.email,
  Company: e.company || '-',
  'Project type': e.service,
  Budget: e.budget || 'To discuss',
  Timeline: e.timeline || 'To discuss',
  Brief: e.brief,
});

export function enquiryText(e: Enquiry) {
  return [
    `Name: ${e.name}`,
    `Email: ${e.email}`,
    `Company: ${e.company || '-'}`,
    `Project type: ${e.service}`,
    `Budget: ${e.budget || 'To discuss'}`,
    `Timeline: ${e.timeline || 'To discuss'}`,
    '',
    e.brief,
  ].join('\n');
}
