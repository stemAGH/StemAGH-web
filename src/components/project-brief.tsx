'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  enquiryText,
  formSubmitFields,
  limits,
  serviceFromQuery,
  services,
  validateEnquiry,
  type Enquiry,
} from '@/content/enquiry';
import { site } from '@/content/site';

type State =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent'; name: string }
  | { kind: 'invalid'; message: string }
  | { kind: 'fallback'; mailto: string; reason: 'not-configured' | 'failed' };

const mailtoFor = (e: Enquiry) =>
  `mailto:${site.contactEmail}?subject=${encodeURIComponent(`Project enquiry: ${e.service}`)}&body=${encodeURIComponent(enquiryText(e))}`;

export function ProjectBrief() {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const startedAt = useRef(0);
  const status = useRef<HTMLElement>(null);
  const serviceSelect = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    // Preselect from links like /contact?service=web. Set on the DOM, so the server render matches.
    const q = new URLSearchParams(location.search).get('service');
    if (q && serviceFromQuery[q] && serviceSelect.current)
      serviceSelect.current.value = serviceFromQuery[q];
  }, []);

  useEffect(() => {
    if (state.kind !== 'idle' && state.kind !== 'sending') status.current?.focus();
  }, [state.kind]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    const enquiry = validateEnquiry(data);
    if (typeof enquiry === 'string') return setState({ kind: 'invalid', message: enquiry });
    setState({ kind: 'sending' });
    // The server silently drops forms sent within 3s of opening (bots). A fast human waits instead.
    const early = 3200 - (Date.now() - startedAt.current);
    if (early > 0) await new Promise((r) => setTimeout(r, early));
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...enquiry, hp: data.hp, startedAt: startedAt.current }),
      });
      const sent = () =>
        setState({ kind: 'sent', name: enquiry.name.split(' ')[0] ?? enquiry.name });
      if (res.ok) {
        const reply = (await res.json()) as { relay?: string; to?: string };
        if (reply.relay !== 'formsubmit' || !reply.to) return sent();
        // FormSubmit only accepts posts from the visitor's browser, so relay from here.
        const fs = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(reply.to)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(formSubmitFields(enquiry)),
        });
        const out = (await fs.json().catch(() => ({}))) as { success?: string | boolean };
        if (fs.ok && String(out.success) === 'true') return sent();
        return setState({ kind: 'fallback', mailto: mailtoFor(enquiry), reason: 'failed' });
      }
      if (res.status === 422) {
        const { error } = await res.json();
        return setState({ kind: 'invalid', message: error });
      }
      setState({
        kind: 'fallback',
        mailto: mailtoFor(enquiry),
        reason: res.status === 503 ? 'not-configured' : 'failed',
      });
    } catch {
      setState({ kind: 'fallback', mailto: mailtoFor(enquiry), reason: 'failed' });
    }
  }

  return (
    <div id="project-brief" className="project-brief">
      <div>
        <p className="eyebrow">YOUR FIRST STEP</p>
        <h2>Tell us what you need.</h2>
        <p>
          A short brief helps us discuss the right scope. Include your goals, any existing website
          or software, and the problem you want to solve.
        </p>
        <ol>
          <li>
            <b>01</b> Share your requirements
          </li>
          <li>
            <b>02</b> Discuss fit and feasibility
          </li>
          <li>
            <b>03</b> Review a written proposal
          </li>
        </ol>
        <small>
          We use these details only to reply to your enquiry. See our{' '}
          <a href="/privacy" className="underline underline-offset-4">
            privacy notice
          </a>
          .
        </small>
      </div>

      {state.kind === 'sent' ? (
        <div
          ref={status as React.RefObject<HTMLDivElement>}
          tabIndex={-1}
          role="status"
          className="brief-done"
        >
          <span aria-hidden="true">✓</span>
          <h3>Thanks, {state.name}. Your brief is with us.</h3>
          <p>
            We’ll reply to the email address you gave. If anything changes in the meantime, write to{' '}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
          </p>
        </div>
      ) : (
        <form onSubmit={submit}>
          <div className="brief-row">
            <label>
              Your name
              <input name="name" autoComplete="name" required maxLength={limits.name} />
            </label>
            <label>
              Email address
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={limits.email}
              />
            </label>
          </div>
          <div className="brief-row">
            <label>
              Company <span className="optional">(optional)</span>
              <input name="company" autoComplete="organization" maxLength={limits.company} />
            </label>
            <label>
              What do you need?
              <select name="service" ref={serviceSelect} defaultValue={services[0]}>
                {services.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="brief-row">
            <label>
              Budget <span className="optional">(optional)</span>
              <select name="budget" defaultValue="">
                <option value="">Not sure yet</option>
                <option>Under ₹1 lakh</option>
                <option>₹1–5 lakh</option>
                <option>₹5–15 lakh</option>
                <option>Above ₹15 lakh</option>
              </select>
            </label>
            <label>
              Preferred timeline <span className="optional">(optional)</span>
              <input
                name="timeline"
                placeholder="e.g. Within 2–3 months"
                maxLength={limits.timeline}
              />
            </label>
          </div>
          <label>
            What would you like to achieve?
            <textarea
              name="brief"
              required
              minLength={10}
              rows={5}
              maxLength={limits.brief}
              placeholder="Tell us about your business, goals and any features you need."
            />
          </label>
          <label className="hp" aria-hidden="true">
            Leave this empty
            <input name="hp" tabIndex={-1} autoComplete="off" />
          </label>
          <button className="studio-button" type="submit" disabled={state.kind === 'sending'}>
            {state.kind === 'sending' ? 'Sending…' : 'Send project brief'} <span>↗</span>
          </button>

          {state.kind === 'invalid' && (
            <p
              ref={status as React.RefObject<HTMLParagraphElement>}
              tabIndex={-1}
              role="alert"
              className="brief-error"
            >
              {state.message}
            </p>
          )}
          {state.kind === 'fallback' && (
            <div
              ref={status as React.RefObject<HTMLDivElement>}
              tabIndex={-1}
              role="alert"
              className="brief-draft"
            >
              <strong>
                {state.reason === 'failed'
                  ? 'We couldn’t send that just now.'
                  : 'Send your brief by email.'}
              </strong>
              <p>
                Your details are ready in an email draft. Open it in your email app and press send;
                nothing has been lost.
              </p>
              <a className="studio-button" href={state.mailto}>
                Open email draft ↗
              </a>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
