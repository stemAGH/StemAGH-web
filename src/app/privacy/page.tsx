import type { Metadata } from 'next';
import { openGraph } from '@/content/seo';
import { site } from '@/content/site';

const description = 'How the StemAGH website handles project enquiries and visitor data.';

export const metadata: Metadata = {
  title: 'Privacy notice',
  description,
  openGraph: openGraph('Privacy notice | StemAGH', description, '/privacy'),
};

const updated = '1 November 2026';

// Describes what this site actually does. Update it whenever analytics, forms or embeds change.
const sections: [string, React.ReactNode][] = [
  [
    'Who we are',
    <>
      StemAGH builds websites, web applications and custom software. For anything in this notice,
      write to <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
    </>,
  ],
  [
    'Project enquiries',
    <>
      When you send the project brief on our contact page, we receive your name, email address, and
      whatever you choose to tell us about your company, budget, timeline and project. We use it
      only to reply to you and to prepare a proposal. The form is emailed to our inbox from our
      website’s server through our own email provider or, as a backup, from your browser through
      FormSubmit (formsubmit.co), a form-to-email service. We do not add you to a mailing list, and
      we do not sell or share your details. Ask us at any time to see or delete what we hold.
    </>,
  ],
  [
    'Email',
    <>
      If you email us directly, your message stays in our mailbox for as long as we need it to
      handle your enquiry or project.
    </>,
  ],
  [
    'Cookies and analytics',
    <>
      This website sets no cookies and runs no analytics or advertising trackers. It loads no
      third-party scripts or fonts.
    </>,
  ],
  [
    'Interactive demos',
    <>
      Demos on our work page run entirely in your browser. Anything you enter in them is saved in
      your browser’s local storage only; it is never sent to us. Use “Reset demo data” or clear your
      browser data to remove it.
    </>,
  ],
  [
    'Hosting',
    <>
      The site is hosted by Vercel. Like any web host, Vercel processes technical request data such
      as IP address and browser type to deliver and protect the site, under its own privacy policy.
    </>,
  ],
];

export default function PrivacyPage() {
  return (
    <div className="studio-home">
      <section className="studio-section studio-wrap legal-page" aria-labelledby="privacy-title">
        <p className="eyebrow">STEMAGH / PRIVACY</p>
        <h1 id="privacy-title">Privacy notice</h1>
        <p className="legal-updated">Last updated {updated}</p>
        {sections.map(([title, body]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </section>
        ))}
      </section>
    </div>
  );
}
