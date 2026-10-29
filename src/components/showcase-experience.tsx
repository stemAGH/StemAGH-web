'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import './showcase-experience.css';

const DEMO = 'https://stemagh-demo.ashish-on-sora.chatgpt.site/';
const chapters = [
  {
    eyebrow: '01 / OVERVIEW',
    title: 'See the bigger picture.',
    description:
      'Put the information that matters into one clear workspace, designed for how your team actually works.',
  },
  {
    eyebrow: '02 / WORKFLOWS',
    title: 'Make progress visible.',
    description:
      'Keep work moving through defined stages, with clear ownership and an experience tailored to your process.',
  },
  {
    eyebrow: '03 / TEAM ACCESS',
    title: 'Built for every role.',
    description:
      'Create focused workspaces for administrators, teams and customers with appropriate access controls.',
  },
  {
    eyebrow: '04 / CUSTOMIZATION',
    title: 'Make it yours.',
    description:
      'Connect your tools, simplify operations and create a platform that evolves as your organization grows.',
  },
];

function ConceptScreen({ active }: { active: number }) {
  const chapter = chapters[active] ?? chapters[0]!;
  return (
    <div
      className="sx-concept"
      aria-label="Illustrative application interface (not an actual demo screenshot)"
    >
      <aside className="sx-sidebar">
        <strong className="sx-mark">
          S<span>.</span>
        </strong>
        <small>WORKSPACE</small>
        {['Overview', 'Workflows', 'Team', 'Customize'].map((name, i) => (
          <div className={'sx-nav ' + (active === i ? 'sx-selected' : '')} key={name}>
            <b>{['◫', '⇄', '◎', '⚙'][i]}</b>
            <span>{name}</span>
          </div>
        ))}
        <span className="sx-sidebar-footer">STEMAGH STUDIO</span>
      </aside>
      <div className="sx-dash">
        <header>
          <div>
            <small>DEMO CONCEPT / {chapter.eyebrow}</small>
            <h3>
              {
                [
                  'Dashboard overview',
                  'Workflow pipeline',
                  'People & permissions',
                  'Your platform, your way',
                ][active]
              }
            </h3>
          </div>
          <i>SA</i>
        </header>
        <div key={active} className="sx-dash-body">
          {active === 0 && (
            <>
              <div className="sx-metrics">
                {[
                  ['Active items', '128'],
                  ['In progress', '34'],
                  ['Completed', '94'],
                ].map(([n, v]) => (
                  <div key={n}>
                    <small>{n}</small>
                    <strong>{v}</strong>
                    <span>Example metric</span>
                  </div>
                ))}
              </div>
              <div className="sx-panel">
                <div className="sx-panel-heading">
                  Activity overview <span>Recent activity</span>
                </div>
                <div className="sx-bars">
                  {[44, 70, 55, 81, 66, 93, 58, 88, 74, 97, 68, 87, 61, 95].map((h, i) => (
                    <i key={i} style={{ height: h + '%' }} />
                  ))}
                </div>
                <div className="sx-chart-labels">
                  <span>MON</span>
                  <span>WED</span>
                  <span>FRI</span>
                  <span>SUN</span>
                </div>
              </div>
            </>
          )}
          {active === 1 && (
            <div className="sx-board">
              {[
                ['To do', 'New enquiry', 'Requirements review'],
                ['In progress', 'Design review', 'Integrations'],
                ['Complete', 'Launch checklist', 'Training'],
              ].map(([title, ...tasks], i) => (
                <div key={title}>
                  <h4>
                    {title} <span>0{i + 3}</span>
                  </h4>
                  {tasks.map((task) => (
                    <article key={task}>
                      <span className="sx-dot" />
                      {task}
                      <small>Example workflow</small>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          )}
          {active === 2 && (
            <div className="sx-panel sx-people">
              <div className="sx-panel-heading">
                Workspace access <span>Example roles</span>
              </div>
              {[
                ['AD', 'Administrator', 'Full platform'],
                ['PM', 'Project manager', 'Projects & reporting'],
                ['TM', 'Team member', 'Assigned workflows'],
                ['CL', 'Customer', 'Customer portal'],
              ].map(([initials, role, access]) => (
                <div className="sx-person" key={role}>
                  <i>{initials}</i>
                  <div>
                    <b>{role}</b>
                    <small>{access}</small>
                  </div>
                  <span>ACTIVE</span>
                </div>
              ))}
            </div>
          )}
          {active === 3 && (
            <div className="sx-options">
              {[
                ['◈', 'Dashboards', 'See what matters'],
                ['⇄', 'Integrations', 'Connect your tools'],
                ['▣', 'Client portals', 'Serve customers'],
                ['◇', 'Automation', 'Simplify routine work'],
              ].map(([icon, title, body]) => (
                <article key={title}>
                  <span>{icon}</span>
                  <b>{title}</b>
                  <small>{body}</small>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ShowcaseExperience() {
  const [active, setActive] = useState(0);
  const [launched, setLaunched] = useState(false);
  const chaptersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = Array.from(chaptersRef.current?.querySelectorAll<HTMLElement>('[data-step]') ?? []);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(Number((visible[0].target as HTMLElement).dataset.step));
      },
      { rootMargin: '-20% 0px -20% 0px', threshold: [0, 0.25, 0.5, 0.75] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sx">
      <section className="sx-hero">
        <div className="sx-wrap">
          <div className="sx-label">
            <i /> STEMAGH / DIGITAL EXPERIENCES
          </div>
          <h1>
            Software that fits
            <br />
            <em>the way you work.</em>
          </h1>
          <p>
            Imagine an application designed around your business, not the other way around. Discover
            the possibilities, then explore a live demo.
          </p>
          <div className="sx-actions">
            <a className="sx-button sx-primary" href="#story">
              Explore the experience ↓
            </a>
            <Link className="sx-button sx-outline" href="/contact#project-brief">
              Discuss your project ↗
            </Link>
          </div>
          <div className="sx-scroll-hint">
            SCROLL TO EXPLORE <span>↓</span>
          </div>
        </div>
      </section>
      <section className="sx-intro sx-wrap">
        <span className="sx-label">01 / THE POSSIBILITIES</span>
        <h2>
          One platform.
          <br />
          <em>Your priorities.</em>
        </h2>
        <p>
          From workflows and dashboards to customer-facing portals, we design tailored software
          around the problems your organization wants to solve.
        </p>
      </section>
      <section className="sx-story" id="story">
        <div className="sx-wrap sx-story-grid">
          <div className="sx-visual-column">
            <div className="sx-stick">
              <div className="sx-browser">
                <div className="sx-browser-top">
                  <div className="sx-dots">
                    <i />
                    <i />
                    <i />
                  </div>
                  <span>APPLICATION CONCEPT — STEMAGH</span>
                  <b>S.</b>
                </div>
                <ConceptScreen active={active} />
                <div className="sx-browser-bottom">
                  <span>ILLUSTRATIVE UI · NOT A LIVE DEMO SCREENSHOT</span>
                  <span>0{active + 1} / 04</span>
                </div>
              </div>
              <div className="sx-visual-caption">
                <i />
                {chapters[active]?.title}
                <span>SCROLL ↓</span>
              </div>
            </div>
          </div>
          <div className="sx-steps" ref={chaptersRef}>
            {chapters.map((step, i) => (
              <article
                key={step.eyebrow}
                data-step={i}
                className={'sx-step ' + (active === i ? 'sx-step-active' : '')}
              >
                <span className="sx-label">{step.eyebrow}</span>
                <h2>{step.title}</h2>
                <p>{step.description}</p>
                <div className="sx-step-line">
                  <i />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="sx-live" id="live-demo">
        <div className="sx-wrap">
          <div className="sx-live-heading">
            <span className="sx-label">02 / INTERACTIVE EXPERIENCE</span>
            <h2>
              Enough showing.
              <br />
              <em>Start exploring.</em>
            </h2>
            <p>
              Now try the actual application. This externally hosted demo may have different
              capabilities and visuals from the illustrative presentation above.
            </p>
          </div>
          <div className="sx-live-window">
            <div className="sx-live-bar">
              <span>
                <i /> LIVE APPLICATION DEMO
              </span>
              <a href={DEMO} rel="noopener noreferrer" target="_blank">
                Open full screen ↗
              </a>
            </div>
            {launched ? (
              <iframe
                className="sx-frame"
                title="Interactive StemAGH demo app"
                src={DEMO}
                loading="lazy"
                allow="fullscreen"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <div className="sx-gate">
                <span className="sx-gate-icon">↗</span>
                <h3>Your turn to explore.</h3>
                <p>Launch the live application inside this page or open it in a new tab.</p>
                <button
                  onClick={() => setLaunched(true)}
                  type="button"
                  className="sx-button sx-primary"
                >
                  Launch interactive demo ↗
                </button>
                <a href={DEMO} target="_blank" rel="noopener noreferrer">
                  Open directly in a new tab ↗
                </a>
              </div>
            )}
          </div>
          <p className="sx-note">
            If the embedded application is blocked by the external host&rsquo;s framing policy, use
            “Open full screen.” Rehosting the demo on your own subdomain can enable a seamless
            inline experience.
          </p>
        </div>
      </section>
      <section className="sx-outro sx-wrap">
        <span className="sx-label">03 / BUILD SOMETHING YOUR OWN</span>
        <h2>
          This is one possibility.
          <br />
          <em>What could we build for you?</em>
        </h2>
        <p>
          Customer portals, internal tools, reporting dashboards, business workflows and
          integrations—scoped for your requirements.
        </p>
        <Link className="sx-button sx-primary" href="/contact#project-brief">
          Let&rsquo;s discuss your application ↗
        </Link>
        <Link className="sx-secondary-link" href="/services">
          Explore our services →
        </Link>
      </section>
    </div>
  );
}
