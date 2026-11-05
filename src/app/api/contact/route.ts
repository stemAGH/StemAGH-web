import nodemailer from 'nodemailer';
import { enquiryText, subjectFor, validateEnquiry, type Enquiry } from '@/content/enquiry';
import { site } from '@/content/site';

/*
 * Project enquiries, emailed to CONTACT_TO (default site.contactEmail). First match wins:
 * - SMTP: SMTP_HOST + SMTP_USER + SMTP_PASS (e.g. the contact@ mailbox on Lark Mail). Sends from
 *   our own mailbox, so no third party is involved. Preferred.
 * - Resend: RESEND_API_KEY + CONTACT_FROM (a sender on a domain verified in Resend).
 * - Otherwise (the default) this route validates and answers { relay: 'web3forms', key }, and the
 *   visitor's browser posts to Web3Forms: its free plan refuses server-side requests. The key
 *   (site.web3formsKey, or WEB3FORMS_KEY to override) picks the receiving inbox and is public.
 *   Replaced FormSubmit, which was down on 5 Nov 2026 (522 on every request).
 * CONTACT_DELIVERY=off (tests) answers 503 with no relay, so nothing is ever sent.
 */

const json = (status: number, body: object) => Response.json(body, { status });

async function sendSmtp(e: Enquiry, to: string) {
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER!;
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user, pass: process.env.SMTP_PASS },
    // Fail fast: a visitor is waiting, and the browser falls back to an email draft on error.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  await transport.sendMail({
    from: process.env.CONTACT_FROM || `StemAGH website <${user}>`,
    to,
    replyTo: e.email,
    subject: subjectFor(e),
    text: enquiryText(e),
  });
}

async function sendResend(e: Enquiry, to: string, key: string, from: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: e.email,
      subject: subjectFor(e),
      text: enquiryText(e),
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`resend ${res.status}`);
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
  if (!to || process.env.CONTACT_DELIVERY === 'off') return json(503, { error: 'not-configured' });

  const { SMTP_HOST, SMTP_USER, SMTP_PASS, RESEND_API_KEY, CONTACT_FROM } = process.env;
  // Half-configured SMTP is a mistake, not a choice: say so instead of quietly using the relay.
  const smtpMissing = Object.entries({ SMTP_HOST, SMTP_USER, SMTP_PASS })
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (smtpMissing.length > 0 && smtpMissing.length < 3) {
    console.error('contact: SMTP is partly configured; missing', smtpMissing.join(', '));
    return json(503, { error: 'smtp-incomplete' });
  }
  try {
    if (SMTP_HOST && SMTP_USER && SMTP_PASS) await sendSmtp(enquiry, to);
    else if (RESEND_API_KEY && CONTACT_FROM)
      await sendResend(enquiry, to, RESEND_API_KEY, CONTACT_FROM);
    else {
      const key = process.env.WEB3FORMS_KEY || site.web3formsKey;
      return key ? json(200, { relay: 'web3forms', key }) : json(503, { error: 'not-configured' });
    }
  } catch (err) {
    // Never log the enquiry itself: it holds the visitor's personal details.
    console.error('contact: send failed', (err as Error).message);
    return json(502, { error: 'send-failed' });
  }
  return json(200, { ok: true });
}
