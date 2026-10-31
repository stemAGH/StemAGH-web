import { enquiryText, validateEnquiry } from '@/content/enquiry';
import { site } from '@/content/site';

/*
 * Project enquiries. Sends through Resend's REST API when configured; otherwise answers 503 and
 * the form falls back to a prepared email, so no enquiry is lost.
 * Env: RESEND_API_KEY (secret); CONTACT_FROM, a sender on a domain verified in Resend, e.g.
 * "StemAGH website <website@stemagh.com>"; CONTACT_TO, optional, defaults to site.contactEmail.
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

  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_TO || site.contactEmail;
  if (!key || !from || !to) return json(503, { error: 'not-configured' });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: enquiry.email,
      subject: `Project enquiry: ${enquiry.service} (${enquiry.name})`,
      text: enquiryText(enquiry),
    }),
  }).catch(() => null);

  if (!res?.ok) {
    console.error('contact: send failed', res?.status);
    return json(502, { error: 'send-failed' });
  }
  return json(200, { ok: true });
}
