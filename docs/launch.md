# Launch checklist and content maintenance

Confirmed configuration: GitHub repository `stemAGH/stemagh-web`; production domain
`stemagh.com`; canonical URL `https://www.stemagh.com`; general enquiries `contact@stemagh.com`
(the owner has confirmed it can send and receive mail; this project has not verified it).

## 1. Environment variable

One variable, build-time only, not secret:

```
SITE_URL=https://www.stemagh.com
```

Set it in Vercel under **Project Settings > Environment Variables**, for the **Production**
environment only. Leave Preview and Development unset, so preview deployments never claim the
production URL as canonical. It is not `NEXT_PUBLIC_`: every route that uses it is prerendered, so
the value is baked into the HTML at build time and never reaches client JavaScript. Keep Vercel's
"Automatically expose System Environment Variables" on (the default): the build reads `VERCEL_ENV`.

`src/content/site-url.ts` validates it and fails the build with a clear message:

- Unset on a Vercel **production** build: build fails ("SITE_URL is required").
- Unset anywhere else: domain metadata is off (no canonical, no `og:image`, empty sitemap).
- Set but invalid: build fails everywhere. Rejected: `http://`, a trailing slash, a path, query,
  credentials, `localhost`, IP addresses, `example.*`, reserved TLDs (`.test`, `.invalid`, `.local`),
  and hostnames with no dot.

With a valid value, every page gets a canonical link, `og:url`, `og:image` (`/og.png`), a Twitter
card, and the sitemap and robots file use it. The 404 page deliberately has no canonical and is
`noindex`. Verify a build locally:

```bash
SITE_URL=https://www.stemagh.com pnpm test:e2e   # includes e2e/production-seo.spec.ts
```

Without `SITE_URL`, the same command checks the "off" state instead.

## 2. Vercel project settings

| Setting          | Value                                                                        |
| ---------------- | ---------------------------------------------------------------------------- |
| Framework preset | Next.js (auto-detected)                                                      |
| Root directory   | repository root                                                              |
| Install command  | default (`pnpm install`, detected from `pnpm-lock.yaml`)                     |
| Build command    | default (`next build` via the `build` script)                                |
| Output directory | default                                                                      |
| Node.js version  | any supported version >= 20.9 (`engines`); note the one the first build uses |
| Environment      | `SITE_URL` in Production, as above                                           |

Checked: the project needs no database, API, server runtime or secrets; every route is
prerendered static; there is no `middleware`/`proxy` file; `next.config.ts` defines no redirects,
rewrites or headers; nothing refers to a local path. Vercel's docs say it supports pnpm 6 to 10 and
that `lockfileVersion: 9.0` is read by pnpm 9 or 10. The lockfile was written by pnpm 11, so it was
tested in a clean copy with pnpm 10: `pnpm install --frozen-lockfile` succeeded. Do not add a
`packageManager` field unless you also add `ENABLE_EXPERIMENTAL_COREPACK=1` (Vercel's docs require
it), which is not needed today. After the first build, read the log and note which pnpm and Node
versions Vercel used.

Source: <https://vercel.com/docs/package-managers>, <https://vercel.com/docs/builds/configure-a-build>.

## 3. Domain and redirect checklist

Required behaviour:

| Request                   | Result                                          |
| ------------------------- | ----------------------------------------------- |
| `https://www.stemagh.com` | serves the site, no hostname redirect           |
| `https://stemagh.com`     | permanent redirect to `https://www.stemagh.com` |
| `http://stemagh.com`      | redirect to `https://www.stemagh.com`           |
| `http://www.stemagh.com`  | redirect to `https://www.stemagh.com`           |

Steps (all external, none done yet):

1. Add `www.stemagh.com` and `stemagh.com` under **Project Settings > Domains**. Vercel suggests
   adding the `www` counterpart when you add an apex domain.
2. Set `www.stemagh.com` as the primary domain and use **Edit > Redirect to** on `stemagh.com` to
   send it to `www.stemagh.com`. Vercel recommends exactly this layout (`www` primary, apex
   redirected).
3. At the DNS provider that hosts `stemagh.com`, create the records the Vercel **Domains** page
   shows for this project. Vercel documents that the apex uses an **A** record and `www` a
   **CNAME**, and that the CNAME value is unique per project. Copy the exact values from the
   dashboard; they are not recorded here because they are not known until the domain is added.
4. Do not add `AAAA` records or leave older `A`/`CNAME` records for these names (Vercel lists
   conflicting records as a cause of "invalid configuration").
5. Keep the existing **MX/TXT** records for `contact@stemagh.com`. Add A/CNAME records at the
   current DNS provider; do not change nameservers unless you also copy every mail record first
   (Vercel warns about this).
6. Wait for DNS to propagate and for Vercel to show both domains as valid; certificates are issued
   by Vercel once DNS is correct.
7. Set `SITE_URL` (Production) and redeploy, so the build picks it up.

The application has no redirects of its own, so the host's redirect is the only one and cannot
conflict with it. Vercel's docs do not state the HTTP status code of a domain redirect or spell
out HTTP-to-HTTPS handling, so test, do not assume:

```bash
curl -sI http://stemagh.com          # expect 301/308 -> https://www.stemagh.com/
curl -sI https://stemagh.com         # expect 301/308 -> https://www.stemagh.com/
curl -sI http://www.stemagh.com      # expect redirect -> https://www.stemagh.com/
curl -sI https://www.stemagh.com     # expect 200, no Location header
curl -sIL http://stemagh.com | grep -iE "^(HTTP|location)"   # no loop, ends at 200
```

Check each hostname's certificate in a browser, then confirm `view-source` on `/` shows
`<link rel="canonical" href="https://www.stemagh.com">`, `/sitemap.xml` and `/robots.txt` use the
`www` host, and a link-preview tool shows the social card.

Source: <https://vercel.com/docs/domains/working-with-domains/add-a-domain>,
<https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting>.

## 4. Source repository

Target: `https://github.com/stemAGH/stemagh-web`. `stemAGH` is a personal GitHub account, not an
organization, so the repository must be created while signed in as `stemAGH` (or after
`gh auth login` as that account). Another account cannot create repositories under it.

Nothing is committed yet. `.gitignore` excludes `.env*` (except `.env.example`), `.vercel`,
`node_modules`, `.next` and `test-results`; `git add -n .` lists 56 source files and no secrets.

## 5. Contact

`contact@stemagh.com` is configured in `src/content/site.ts` and shown only on `/contact`. It is
not in the footer or the structured data. The owner has confirmed it works; this project has not
verified that. Decide who answers enquiries.

## 6. Legal and privacy: operational decisions still open

As built, the site sets no cookies, runs no analytics, has no forms, and loads no third-party
scripts or fonts (the Playwright suite checks cookies and request hosts on every route). That is
why no privacy policy or cookie banner has been written: a policy describing processing that does
not happen would be inaccurate. These decisions belong to the owner:

- **Who is responsible for enquiries and for the site.** StemAGH is not a registered legal entity.
  A privacy or terms page needs a real person or entity named as the responsible party.
- **Hosting-provider logs.** Vercel, like any host, processes request data (for example IP
  address and user agent) to serve and protect the site. Its retention is set by Vercel's own
  documentation and plan, not by this project. Read it before deciding whether a privacy notice is
  needed, and do not state that no logs exist.
- **Email handling.** Mail to `contact@stemagh.com` is personal data: who reads it, where it is
  stored and for how long.
- **Any later change.** Analytics, forms, embeds or a newsletter change the answers above and need
  a notice written against what is actually implemented.

No legal text should be added until these are answered. This is a checklist, not legal advice.

## 7. Maintaining OpenEstate information

OpenEstate's facts live in `src/content/products.ts` and go stale when OpenEstate ships. There is
deliberately no automatic sync; a reviewed edit is more accurate than a scraped one. On every
OpenEstate release (and at least monthly):

1. Read `README.md`, `CHANGELOG.md`, `docs/docs/installation.md` and
   `docs/docs/features-and-usage.md` ("Known gaps") on `master`.
2. Update `version`, and set `reviewedOn` to today. The product page shows this date.
3. Re-check each entry in `limitations`. Delete one when the docs say it is fixed; add any new
   documented gap that matters to a buyer.
4. Re-check `deployment` (supported OS and versions, install command) against the installation guide.
5. Re-check `capabilities` and `highlights` only for claims that changed.
6. Confirm the six `links` still return 200.
7. Run `pnpm lint && pnpm typecheck && pnpm test:e2e`.

Never state something about OpenEstate that its repository does not say.

## 8. Other

- Replace the temporary identity only through `docs/brand.md`; regenerate PNGs with `pnpm brand:build`.
- Confirm the OpenEstate marketing site rebrand is scheduled separately.
