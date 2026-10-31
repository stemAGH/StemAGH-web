import { enquiryText, validateEnquiry, type Enquiry } from '@/content/enquiry';
import { site } from '@/content/site';

/*
 * Project enquiries, emailed to CONTACT_TO (default site.contactEmail).
 * - Resend, when RESEND_API_KEY and CONTACT_FROM (a sender on a verified domain) are set.
 * - Otherwise FormSubmit (formsubmit.co): no account or key. The very first enquiry triggers a
 *   one-time activation email to the inbox; until that link is clicked FormSubmit refuses and the
 *   visitor is offered a prepared email instead, so no enquiry is lost.
 */

const json = (status: number, body: object) => Response.json(body, { status });

const subject = (e: Enquiry) => `Project enquiry: ${e.service} (${e.name})`;

async function viaResend(e: Enquiry, to: string, key: string, from: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: e.email,
      subject: subject(e),
      text: enquiryText(e),
    }),
  });
  return res.ok ? null : `resend ${res.status}`;
}

async function viaFormSubmit(e: Enquiry, to: string, origin: string) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // FormSubmit ties a form to the site it is posted from.
      Origin: origin,
      Referer: `${origin}/contact`,
    },
    body: JSON.stringify({
      _subject: subject(e),
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
    }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    success?: string | boolean;
    message?: string;
  };
  return res.ok && String(data.success) === 'true'
    ? null
    : `formsubmit ${res.status}: ${data.message}`;
}

export async function POST(req: Request) {
  if (!req.headers.get('content-type')?.includes('application/json'))
    return json(415, { error: 'Expected JSON.' });
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: 'Invalid request.' });
  }

  // Spam traps: a hidden field people never fill, and a form sent faster than anyone can type.
  // Both answer "ok" so a bot learns nothing. ponytail: no rate limit; add Vercel WAF rules if spam gets through.
  const started = Number(body.startedAt);
  if (body.hp || !Number.isFinite(started) || Date.now() - started < 3000)
    return json(200, { ok: true });

  const enquiry = validateEnquiry(body);
  if (typeof enquiry === 'string') return json(422, { error: enquiry });

  const to = process.env.CONTACT_TO || site.contactEmail;
  if (!to) return json(503, { error: 'not-configured' });
  // Tests and local builds set CONTACT_DELIVERY=off so they never send real mail.
  if (process.env.CONTACT_DELIVERY === 'off') return json(503, { error: 'not-configured' });

  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const origin = process.env.SITE_URL || new URL(req.url).origin;
  const failure = await (
    key && from ? viaResend(enquiry, to, key, from) : viaFormSubmit(enquiry, to, origin)
  ).catch((e: Error) => e.message);

  if (failure) {
    console.error('contact: send failed:', failure);
    return json(502, { error: 'send-failed' });
  }
  return json(200, { ok: true });
}
