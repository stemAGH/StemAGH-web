Aurelia Estates owner app: an interactive demo shown on /work.

Source: https://github.com/stemAGH/service-app (dist/). Changes made when copying it here:
images converted from 1536px PNG to 1080px WebP (41 MB -> 2 MB) and references updated;
the Google Fonts import replaced with self-hosted DM Sans and Manrope (SIL Open Font
License 1.1) so the site makes no third-party requests; noindex added to index.html.
All project, owner and referral records are illustrative. Anything a visitor enters stays in
their own browser (localStorage keys aurelia-owner-v1, aurelia-passes-v1 and
aurelia-maintenance-v1). Maintenance payments are simulated; no money is collected.
To update: copy the new dist/ over this folder and repeat the steps above (.png -> .webp in every
file, the font line at the top of crystal.css, noindex and the two label fixes in index.html,
LF line endings). Then recapture public/showcase/ from the demo at 390x844.
Last synced: service-app 4f9d23e (2 November 2026, maintenance subscriptions).
