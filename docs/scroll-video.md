# Cinematic scroll video

The homepage inserts `ScrollVideo` between Services and OpenEstate. It uses the existing Next.js/React architecture, a scoped CSS module, native HTML5 seeking and requestAnimationFrame. There are no new packages.

## Supply the real film

No production film has been supplied or generated. The default is a compact branded section with readable project steps and no video request.

1. Put your film at `public/media/stemagh-story.mp4` (create `public/media` if necessary).
2. Optionally put a still from that same film at `public/media/stemagh-story-poster.jpg`.
3. Set these build-time environment variables in `.env.local` locally or your hosting project's environment settings:

   ```text
   SCROLL_VIDEO_SRC=/media/stemagh-story.mp4
   SCROLL_VIDEO_POSTER=/media/stemagh-story-poster.jpg
   ```

4. Rebuild/redeploy. These variables are consumed in `src/content/scroll-video.ts` on the server and passed as public media URLs to the client. They must not contain credentials.

Alternatively, set `src` and `poster` directly in `src/content/scroll-video.ts`. The same file contains the heading, three chapter captions and `fps` (30 by default). Set `fps` to match your encoded film. Do not point at a streaming manifest, YouTube page or live stream; a finite, seekable MP4 is required.

Use a short silent film where the three story beats match the three captions. The supplied text is the accessible narrative; update it to describe the final film accurately. If speech is necessary, extend the component with WebVTT captions and a transcript before using spoken footage.

## Encode for seeking

Prefer MP4/H.264, yuv420p, a consistent frame rate, short keyframe intervals and the metadata atom at the beginning (`+faststart`). A local example for your own input file:

```bash
ffmpeg -i input.mov -an -vf 'scale=1920:-2,fps=30' \
  -c:v libx264 -crf 21 -preset slow -pix_fmt yuv420p \
  -g 15 -keyint_min 15 -sc_threshold 0 -movflags +faststart \
  public/media/stemagh-story.mp4
```

All-intra (`-g 1`) improves seeking but increases file size. Choose resolution/quality against a real device and bandwidth budget. Metadata-only loading does not guarantee zero initial bytes: browsers and servers decide range requests. Seeking may ultimately request much or all of a short film. The media host must support byte ranges (`206 Partial Content`), correct `video/mp4` content type, and HTTPS for remote URLs. Prefer same-origin assets and avoid unnecessarily large 4K sources.

## Behaviour

- On desktops at least 900px wide with a fine pointer and no reduced-motion/data-saving preference, load metadata when the section is within 700px of the viewport. Do not expose the video until a frame is decoded.
- A ready section is 300svh tall; its stage sticks below the existing 80px header. Progress is `(scrollY - sectionStart) / (sectionHeight - stageHeight)`, clamped to 0–1. This maps directly to `0 ... duration - one frame`, forward and backward. No autoplay permission or synthetic scroll locking is needed.
- Each animation frame uses cached geometry and can initiate at most one seek. While seeking, scroll updates coalesce; `seeked` applies the latest target. ResizeObserver refreshes measurements. All observers, listeners, timers and pending animation frames are cleaned up on unmount.
- Captions crossfade at thirds of the scroll distance. The progress line is decorative. All text remains in HTML; there is no live-region announcement on every scroll.
- Mobile/coarse-pointer, reduced-motion and data-saving users get a compact layout with an explicit “Load and play film” button and standard video controls. No source is attached until that action. Playback stays muted.
- Slow loading/deep-link arrival uses native playback rather than expanding a section under the reader. A 12-second preparation timeout also falls back to native playback. Decode/load failure restores the static narrative. These fallback choices remain in place for that visit.
- No source, or JavaScript disabled: a normal compact content section, without an empty multi-screen scroll runway.

The video uses `object-fit: cover` in the desktop stage, so keep important content away from its edges. Native playback uses a 16:9 surface. Adjust these rules in `scroll-video.module.css` for a final film with a different intended composition.

## Validation

Run lint, typecheck, build and the existing redesign suite. The scroll-video suite tests the unconfigured fallback and pure timeline endpoints. For real-decoder checks without inventing a production asset, use an explicitly temporary QA fixture outside the repository:

```bash
ffmpeg -f lavfi -i 'testsrc2=size=640x360:rate=30:duration=4' \
  -an -c:v libx264 -g 1 -pix_fmt yuv420p -movflags +faststart /tmp/stemagh-scroll-qa.mp4
SCROLL_VIDEO_SRC=/__scroll-video-test.mp4 \
SCROLL_VIDEO_TEST_FILE=/tmp/stemagh-scroll-qa.mp4 \
pnpm exec playwright test e2e/scroll-video.spec.ts
```

Playwright intercepts that special test URL, serving the fixture with byte-range support; it is not a public asset. The cloud runner may need the existing `/workspace/playwright-onboarding.config.mjs` override for system Chromium. Stop any previously running test server first; a build with the test source must not be deployed. After this run, rebuild with the real production configuration (or no source). Verify final footage separately in Safari/iOS and on physical devices; Chromium fixture checks cannot establish final encoding quality or cross-browser frame accuracy.
