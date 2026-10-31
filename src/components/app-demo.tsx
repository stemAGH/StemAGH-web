'use client';
import { useRef, useState } from 'react';

const SRC = '/demos/aurelia/index.html';
const STORAGE_KEYS = ['aurelia-owner-v1', 'aurelia-passes-v1'];

const screens = [
  ['#home', 'Owner home', 'Holdings, plot values and community updates'],
  ['#projects', 'Projects', 'Search, filter and open six project pages'],
  ['#support', 'Support', 'Raise requests and issue QR visitor passes'],
  ['#referral', 'Referrals', 'Refer friends and track rewards'],
] as const;

/** A real, clickable mobile app inside a phone frame. Runs entirely in the visitor's browser. */
export function AppDemo({
  id = 'live-demo',
  heading: Heading = 'h3',
}: {
  id?: string;
  heading?: 'h2' | 'h3';
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [active, setActive] = useState<string>('#home');

  function go(hash: string) {
    setActive(hash);
    const win = frame.current?.contentWindow;
    if (win) win.location.hash = hash;
  }

  function reset() {
    STORAGE_KEYS.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });
    setActive('#home');
    if (frame.current) frame.current.src = `${SRC}#home`;
  }

  return (
    <div className="app-demo" id={id}>
      <div className="app-demo-copy">
        <p className="eyebrow">LIVE DEMO · TAP AROUND</p>
        <Heading>Aurelia Estates owner app</Heading>
        <p>
          A mobile owner app we designed for property developers: holdings and plot values, project
          pages, support requests, QR visitor passes, referrals and a guided assistant.
        </p>
        <ul className="app-demo-screens" aria-label="Jump to a screen">
          {screens.map(([hash, title, text]) => (
            <li key={hash}>
              <button type="button" aria-pressed={active === hash} onClick={() => go(hash)}>
                <strong>{title}</strong>
                <span>{text}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="app-demo-actions">
          <a className="studio-text-link" href={SRC} target="_blank" rel="noopener">
            Open full screen <span>↗</span>
          </a>
          <button type="button" className="studio-text-link" onClick={reset}>
            Reset demo data
          </button>
        </div>
        <small>
          Sample data. Anything you enter stays in your browser and is never sent to us.
        </small>
      </div>
      <div className="phone-frame">
        <iframe
          ref={frame}
          src={`${SRC}#home`}
          title="Aurelia Estates owner app, interactive demo"
          loading="lazy"
          allow="camera"
        />
      </div>
    </div>
  );
}
