# stemagh-web

Corporate website for StemAGH. Phase 1 scaffold: Next.js (App Router), TypeScript, Tailwind CSS v4.

```bash
pnpm install
pnpm exec playwright install chromium   # once, for e2e
pnpm dev                                # http://localhost:3000
pnpm lint && pnpm typecheck && pnpm format:check && pnpm build
pnpm test:e2e                           # builds, serves the production build, runs Playwright
```

Design tokens live in `src/app/globals.css` (`@theme`). The wordmark is a text placeholder in
`src/components/wordmark.tsx`.

## Deployment

Production is configured by one build-time variable, `SITE_URL` (see `.env.example`). Deployment,
domain and redirect steps, and content maintenance are in [`docs/launch.md`](docs/launch.md);
brand assets are in [`docs/brand.md`](docs/brand.md).
