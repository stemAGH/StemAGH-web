import { enquiryText, subjectFor, validateEnquiry } from '@/content/enquiry';
import { site } from '@/content/site';

/*
 * Project enquiries, emailed to CONTACT_TO (default site.contactEmail).
 * - Resend sends from here when RESEND_API_KEY and CONTACT_FROM (verified sender) are set.
 * - Otherwise this route validates and answers { relay: 'formsubmit', to }, and the visitor's
 *   browser posts to FormSubmit, which refuses server-side requests (403 from Vercel).
 * CONTACT_DELIVERY=off (tests) answers 503 with no relay, so nothing is ever sent.
 */

const json = (status: number, body: object) => Response.json(body, { status });

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
  if (!to || process.env.CONTACT_DELIVERY === 'off') return json(503, { error: 'not-configured' });

  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  if (!key || !from) return json(200, { relay: 'formsubmit', to });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: enquiry.email,
      subject: subjectFor(enquiry),
      text: enquiryText(enquiry),
    }),
  }).catch(() => null);
  if (!res?.ok) {
    console.error('contact: resend failed', res?.status);
    return json(502, { error: 'send-failed' });
  }
  return json(200, { ok: true });
}
