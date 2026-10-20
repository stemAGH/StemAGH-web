# UI refresh plan

Branch: `ui-refresh` (never commit to `main`). Based on the UI audit. Phases 2 to 6 are filled in
after Phases 0 and 1 are reviewed.

Rule for Phases 0 and 1: the site must look identical. The visual regression spec
(`e2e/visual.spec.ts`) enforces it with zero tolerated pixel difference.

## Phase 0: Safety net

- [ ] Visual regression spec: every route (incl. 404) at 375, 768, 1280, 1920 px
- [ ] Baseline snapshots generated and committed; spec passes on a second run
- [ ] Lint, typecheck, build and full e2e suite pass

## Phase 1: Consolidation (no visual change)

- [ ] Extract `PageHeader` (4 page-header bands)
- [ ] Extract `Eyebrow` (6 uses, including `SectionHeading`)
- [ ] Extract `Card` (8 hand-written card class strings)
- [ ] Extract `NumberedLabel` (4 "01/02" labels)
- [ ] Shadow tokens in `@theme`; switch the 4 usages
- [ ] Section spacing in one place
- [ ] Logo mark paths from a single source
- [ ] Mobile menu: outside-click close, focus trap, no click handler on a bare `<div>`

## Phase 2: Visual foundations (type scale, borders, accent usage)

## Phase 3: Section variety, hero, and wide-screen layouts

## Phase 4: Visual content (screenshots, icons, illustrations)

## Phase 5: Motion and interaction polish

## Phase 6: Final QA
