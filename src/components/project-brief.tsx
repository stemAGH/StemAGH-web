'use client';
import { useState, type FormEvent } from 'react';

export function ProjectBrief() {
  const [draft, setDraft] = useState<string>();
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nProject type: ${data.get('service')}\nTimeline: ${data.get('timeline') || 'To discuss'}\n\nProject brief:\n${data.get('brief')}`;
    setDraft(
      `mailto:contact@stemagh.com?subject=${encodeURIComponent(`Project enquiry: ${data.get('service')}`)}&body=${encodeURIComponent(body)}`,
    );
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
          This form prepares an email in your own email app. Nothing is submitted automatically or
          stored on this website.
        </small>
      </div>
      <form onSubmit={prepare} onChange={() => setDraft(undefined)}>
        <div className="brief-row">
          <label>
            Your name
            <input name="name" autoComplete="name" required maxLength={100} />
          </label>
          <label>
            Email address
            <input name="email" type="email" autoComplete="email" required maxLength={254} />
          </label>
        </div>
        <div className="brief-row">
          <label>
            What do you need?
            <select name="service">
              <option>Business website</option>
              <option>Web application</option>
              <option>Custom software</option>
              <option>OpenEstate implementation</option>
              <option>Help defining my project</option>
            </select>
          </label>
          <label>
            Preferred timeline
            <input name="timeline" placeholder="e.g. Within 2–3 months" maxLength={120} />
          </label>
        </div>
        <label>
          What would you like to achieve?
          <textarea
            name="brief"
            required
            rows={5}
            maxLength={3000}
            placeholder="Tell us about your business, goals and any features you need."
          />
        </label>
        <button className="studio-button" type="submit">
          Prepare project email <span>↗</span>
        </button>
        {draft && (
          <div role="status" className="brief-draft">
            <strong>Your email draft is ready.</strong>
            <p>
              Open your email app, review the details and send it to start the conversation. Nothing
              has been sent yet.
            </p>
            <a className="studio-button" href={draft}>
              Open email draft ↗
            </a>
          </div>
        )}
      </form>
    </div>
  );
}
