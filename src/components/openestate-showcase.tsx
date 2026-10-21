'use client';
import { useState } from 'react';

const views = ['Dashboard', 'Dues dashboard', 'Reports'] as const;
export function OpenEstateShowcase() {
  const [view, setView] = useState<(typeof views)[number]>('Dashboard');
  return (
    <div className="estate-showcase">
      <div className="estate-tabs" aria-label="OpenEstate interface views">
        {views.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={view === name}
            onClick={() => setView(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="browser-frame">
        <div className="browser-bar">
          <span aria-hidden="true">● ● ●</span>
          <span>OpenEstate / workspace</span>
          <span aria-hidden="true">↗</span>
        </div>
        <div className="estate-app">
          <aside aria-label="Illustrated application navigation">
            <strong>
              OpenEstate<span>®</span>
            </strong>
            <div className="estate-side-active">▦ &nbsp; Dashboard</div>
            {[
              'PRE-SALES',
              'Inquiries',
              'Reports',
              'INVENTORY',
              'Projects',
              'POST-SALES',
              'New Booking',
              'Receipt Entry',
              'Dues Dashboard',
              'ADMIN',
              'Users & Roles',
            ].map((x) => (
              <div key={x} className={x === x.toUpperCase() ? 'estate-side-label' : ''}>
                {x}
              </div>
            ))}
            <div className="estate-side-foot">◉ &nbsp; Demo workspace</div>
          </aside>
          <div className="estate-main">
            <div className="estate-top">
              <span>Workspace / Overview</span>
              <span>Demo account &nbsp; ◉</span>
            </div>
            <div className="estate-content">
              <div className="estate-title">
                <div>
                  <p>YOUR BUSINESS, AT A GLANCE</p>
                  <h3>{view === 'Dues dashboard' ? 'Dues Dashboard' : view}</h3>
                </div>
                <span className="estate-export">
                  {view === 'Dashboard' ? 'All projects⌄' : 'Export CSV ↗'}
                </span>
              </div>
              <div className="estate-stats">
                {(view === 'Dues dashboard'
                  ? [
                      ['0–7 DAYS', '2'],
                      ['8–30 DAYS', '0'],
                      ['31–90 DAYS', '0'],
                      ['90+ DAYS', '0'],
                    ]
                  : [
                      ['FOLLOW-UPS DUE', '0'],
                      ['OPEN INQUIRIES', '2'],
                      ['OVERDUE', '0'],
                      ['CONVERTED', '0'],
                    ]
                ).map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                    <i>
                      ● &nbsp; {label?.includes('OVERDUE') ? 'All caught up' : 'Current overview'}
                    </i>
                  </div>
                ))}
              </div>
              {view === 'Reports' ? (
                <div className="estate-report">
                  <span>Collection summary</span>
                  <div>
                    {[42, 67, 51, 83, 64, 96, 75, 88].map((h, i) => (
                      <i key={i} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <p>Illustrative report visualization · sample data</p>
                </div>
              ) : (
                <>
                  <div className="estate-subtitle">
                    <h4>{view === 'Dashboard' ? 'My team' : 'Outstanding instalments'}</h4>
                    <span>Overview ↗</span>
                  </div>
                  <div className="estate-table">
                    <div>
                      <span>{view === 'Dashboard' ? 'TEAM MEMBER' : 'BOOKING'}</span>
                      <span>STATUS</span>
                      <span>{view === 'Dashboard' ? 'INQUIRIES' : 'DUE'}</span>
                    </div>
                    {(view === 'Dashboard'
                      ? ['Sales team', 'Accounts team', 'Operations']
                      : ['BKG/2026-27/000001', 'BKG/2026-27/000006', 'BKG/2026-27/000009']
                    ).map((x, i) => (
                      <div key={x}>
                        <span>
                          <b>{x.charAt(0)}</b>
                          {x}
                        </span>
                        <span className="estate-status">
                          {view === 'Dashboard' ? 'Active' : 'On booking'}
                        </span>
                        <span>{view === 'Dashboard' ? (i === 0 ? '2' : '0') : 'Pending'}</span>
                      </div>
                    ))}
                  </div>
                  <div className="estate-note">
                    <span>✓</span>
                    <div>
                      <strong>A clearer picture of your operations.</strong>
                      <p>Leads, bookings, collections and reports. One workspace.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <p className="illustration-caption">
        Interface illustration based on supplied OpenEstate screenshots. Sample data.
      </p>
    </div>
  );
}
