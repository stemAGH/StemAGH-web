# StemAGH brand notes

A working reference, not a finished brand guideline. Update it when the identity changes.

## Concept

StemAGH is the parent brand; products are branches. The mark is one stem that forks into two
branches: three strokes, round caps, no fill. It echoes the portfolio diagram on the homepage
(parent brand above, products beneath). It is deliberately plain: it reads as a stem or fork, and
it keeps working at 16 px, in one colour, on a light background.

The wordmark is "Stem" in ink and "AGH" in indigo, set in Geist SemiBold with slightly tight
tracking. It is typographic on purpose: the name carries the brand, the mark supports it.

## Assets

| Asset            | Source                         | Notes                                                       |
| ---------------- | ------------------------------ | ----------------------------------------------------------- |
| Mark (inline)    | `src/components/logo-mark.tsx` | `currentColor`; used in header and footer                   |
| Lockup           | `src/components/wordmark.tsx`  | The only place mark and wordmark are combined               |
| Favicon          | `src/app/icon.svg`             | White mark on an indigo rounded square                      |
| Apple touch icon | `src/app/apple-icon.png`       | 180 px, generated                                           |
| Social card      | `public/og.png`                | 1200x630, generated; only referenced when `SITE_URL` is set |

The mark's paths exist in `logo-mark.tsx`, `icon.svg` and `brand/build-assets.mjs`. Change all
three together, then run `pnpm brand:build` to regenerate the two PNGs.

## Colour

| Token               | Value       | Use                                        |
| ------------------- | ----------- | ------------------------------------------ |
| `--color-accent`    | `#3f3fb8`   | Corporate indigo: links, buttons, the mark |
| `--color-ink`       | `#14161c`   | Text and the "Stem" half of the wordmark   |
| `--color-ink-muted` | `#4b5262`   | Secondary text                             |
| `--color-canvas`    | `#fbfbfc`   | Page background                            |
| `--color-product`   | per product | Set per product page via `ProductAccent`   |

OpenEstate's teal (`#0f766e`) is a product colour. It is never used for corporate chrome.

## Rules

- Light backgrounds only. The mark is indigo on light, white on indigo.
- Keep clear space of at least the stem's width around the mark.
- Do not add gradients, outlines or effects to the mark, and do not redraw it.
- A product keeps its own identity; StemAGH appears as the parent, not as a replacement logo.
- No logo implies a legal entity. StemAGH is not registered; do not add "Pvt Ltd", "Inc." or similar.
