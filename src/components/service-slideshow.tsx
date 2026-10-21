'use client';
import { useEffect, useState } from 'react';
const slides = [
  {
    title: 'A website with a clear next step.',
    label: '01 / BUSINESS WEBSITES',
    description: 'Introduce your business. Explain your offer. Make enquiries straightforward.',
    kind: 'website',
  },
  {
    title: 'Your workflow, in one workspace.',
    label: '02 / CUSTOM SOFTWARE',
    description: 'Replace scattered work with tools built around the way your team operates.',
    kind: 'software',
  },
  {
    title: 'A launch you stay in control of.',
    label: '03 / DEPLOYMENT & HANDOVER',
    description: 'Hosting in your account, documented access and a clear handover.',
    kind: 'launch',
  },
];
export function ServiceSlideshow() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setPlaying(!media.matches);
    change();
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (!playing || hovered || focused) return;
    const timer = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [playing, hovered, focused]);
  const slide = slides[index]!;
  const next = (step: number) => {
    setPlaying(false);
    setIndex((i) => (i + step + slides.length) % slides.length);
  };
  return (
    <section
      className="service-slideshow"
      aria-roledescription="carousel"
      aria-label="What we build"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <div className="slide-visual" key={slide.kind} aria-hidden="true">
        <div className="slide-window">
          <div className="slide-window-bar">
            <span>● ● ●</span>
            <span>STEMAGH / {slide.kind.toUpperCase()}</span>
            <span>↗</span>
          </div>
          {slide.kind === 'website' ? (
            <div className="website-demo">
              <div className="demo-nav">
                <b>YOUR BUSINESS.</b>
                <span>About &nbsp; Services &nbsp; Contact</span>
              </div>
              <div className="demo-website-body">
                <span>MADE FOR WHAT’S NEXT</span>
                <strong>
                  A better first
                  <br />
                  impression.
                </strong>
                <p>Your expertise. A website that shows it.</p>
                <i>Start a conversation ↗</i>
              </div>
              <div className="demo-grid">
                <span>Clear messaging</span>
                <span>Mobile ready</span>
                <span>Built to enquire</span>
              </div>
            </div>
          ) : slide.kind === 'software' ? (
            <div className="software-demo">
              <div>
                <b>WORKSPACE</b>
                <span>Overview</span>
                <span>Projects</span>
                <span>Workflows</span>
                <span>Reports</span>
              </div>
              <div>
                <span>OPERATIONS / OVERVIEW</span>
                <strong>Keep work moving.</strong>
                <div className="demo-metrics">
                  <i>
                    Projects<b>03</b>
                  </i>
                  <i>
                    In progress<b>08</b>
                  </i>
                  <i>
                    To review<b>02</b>
                  </i>
                </div>
                {['Discovery & requirements', 'Design review', 'Development milestone'].map(
                  (s, i) => (
                    <p key={s}>
                      <span>{s}</span>
                      <b>{['Complete', 'In review', 'In progress'][i]}</b>
                    </p>
                  ),
                )}
              </div>
            </div>
          ) : (
            <div className="launch-demo">
              <div className="launch-orbit">↗</div>
              <strong>Ready for your next step.</strong>
              <p>YOUR DOMAIN → YOUR HOSTING → YOUR WEBSITE</p>
              <div>
                {['Domain connected', 'Deployment reviewed', 'Access handed over'].map((x) => (
                  <span key={x}>✓ {x}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <span className="slide-annotation">CONCEPT INTERFACE · ILLUSTRATIVE CONTENT</span>
      </div>
      <div className="slide-copy" aria-live={playing ? 'off' : 'polite'}>
        <p>{slide.label}</p>
        <h2>{slide.title}</h2>
        <span>{slide.description}</span>
      </div>
      <div className="slide-controls">
        <div className="slide-dots">
          {slides.map((s, i) => (
            <button
              key={s.kind}
              type="button"
              aria-label={`Show ${s.kind} slide`}
              aria-pressed={i === index}
              onClick={() => {
                setIndex(i);
                setPlaying(false);
              }}
            >
              <span />
            </button>
          ))}
        </div>
        <div>
          <button
            type="button"
            aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
            onClick={() => setPlaying(!playing)}
          >
            {playing ? 'Pause' : 'Play'}
          </button>
          <button type="button" aria-label="Previous slide" onClick={() => next(-1)}>
            ←
          </button>
          <button type="button" aria-label="Next slide" onClick={() => next(1)}>
            →
          </button>
        </div>
      </div>
    </section>
  );
}
