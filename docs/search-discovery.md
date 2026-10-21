# Search and AI discovery

The site renders its primary text and links on the server. Scroll effects enhance that HTML; they do not replace it. Titles and descriptions describe services directly, and /services is a crawlable reference for deliverables and terms.

Production requires SITE_URL=https://www.stemagh.com at build time. This controls canonical URLs, social URLs, sitemap entries and stable schema identifiers. Set it only for the intended production deployment. Vercel preview builds send noindex/nofollow metadata. Keep platform preview protection enabled where available.

Organization and WebSite JSON-LD establish the site identity. The services page describes its visible service offerings and links them to that organization. OpenEstate retains its SoftwareApplication data. Do not add fabricated reviews, ratings, prices, customer counts, locations or guarantees.

/llms.txt is a supplemental plain-text summary with links to authoritative pages. It is an emerging convention, not a search-engine requirement or a guarantee of AI visibility. Public crawlers use the same accessible content and robots rules as other visitors. AI citations and rankings cannot be guaranteed.

After production deployment:

- Verify HTTPS, redirects and canonicals on the actual domain.
- Verify /robots.txt and /sitemap.xml, then submit the sitemap in Google Search Console and Bing Webmaster Tools using the owner's verified accounts.
- Inspect the live structured data and rendered pages. Monitor indexing and Core Web Vitals with real traffic; local checks are not field performance measurements.
- Keep service descriptions, product status, limitations and contact information current. Add real case studies and testimonials only with evidence and permission.

Validation: SITE_URL=https://www.stemagh.com pnpm exec playwright test e2e/production-seo.spec.ts --config=/workspace/playwright-onboarding.config.mjs (cloud runner using system Chromium). The tests verify canonicals, social metadata, sitemap, identity/service data, plain-text summary and primary content without JavaScript.
