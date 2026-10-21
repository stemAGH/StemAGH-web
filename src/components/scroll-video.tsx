'use client';

import { useEffect, useRef, useState } from 'react';
import { scrollProgress, videoTime } from './scroll-video-timeline';
import styles from './scroll-video.module.css';

type Chapter = { title: string; body: string };
type Props = { src?: string; poster?: string; title: string; fps?: number; chapters: Chapter[] };
type Mode = 'static' | 'loading' | 'scrub' | 'native' | 'error';

/** Native seeking, with at most one seek in flight and no render loop in React. */
export function ScrollVideo({ src, poster, title, fps = 30, chapters }: Props) {
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const nativeRequest = useRef<(() => void) | null>(null);
  const [mode, setMode] = useState<Mode>('static');

  useEffect(() => {
    const root = section.current;
    const stage = pin.current;
    const film = video.current;
    if (!src || !root || !stage || !film) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(min-width: 900px) and (pointer: fine)');
    const connection = (
      navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }
    ).connection;
    let frame = 0;
    let near = false;
    let loaded = false;
    let active = false;
    let nativeMode = false;
    let start = 0;
    let distance = 1;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const canScrub = () => desktop.matches && !reduced.matches && !connection?.saveData;
    const measure = () => {
      start =
        root.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(stage).top || '0');
      distance = root.offsetHeight - stage.offsetHeight;
    };
    const draw = () => {
      frame = 0;
      if (!active || !near || document.hidden) return;
      const progress = scrollProgress(scrollY, start, distance);
      root.style.setProperty('--film-progress', String(progress));
      root.dataset.chapter = String(
        Math.min(chapters.length - 1, Math.floor(progress * chapters.length)),
      );
      const target = videoTime(progress, film.duration, fps);
      // Rapid scrolling coalesces into the latest target; seeked schedules the next update.
      if (
        !film.seeking &&
        film.readyState >= 1 &&
        Math.abs(film.currentTime - target) > 1 / (fps * 2)
      ) {
        try {
          film.currentTime = target;
        } catch {
          /* A decoder can reject a seek until metadata is usable. */
        }
      }
    };
    const schedule = () => {
      if (!frame && active && near) frame = requestAnimationFrame(draw);
    };
    const fallback = () => {
      const wasActive = active;
      active = false;
      nativeMode = true;
      root.dataset.mode = 'native';
      setMode('native');
      if (wasActive) film.pause();
      cancelAnimationFrame(frame);
      frame = 0;
      clearTimeout(timeout);
    };
    const ready = () => {
      clearTimeout(timeout);
      if (nativeMode) return;
      if (!canScrub()) {
        fallback();
        return;
      }
      if (active) {
        schedule();
        return;
      }
      // Do not expand a section already under the reader: slow loads/deep links get native playback.
      if (root.getBoundingClientRect().top < innerHeight * 0.2) {
        fallback();
        return;
      }
      active = true;
      film.pause();
      root.dataset.mode = 'scrub';
      setMode('scrub');
      measure();
      schedule();
    };
    const metadata = () => {
      if (nativeMode) return;
      if (!Number.isFinite(film.duration) || film.duration <= 0) {
        fallback();
        return;
      }
      // Ask the decoder for a real frame before exposing the video surface.
      try {
        film.currentTime = Math.min(0.001, film.duration / 2);
      } catch {
        fallback();
      }
    };
    const failed = () => {
      active = false;
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
      frame = 0;
      root.dataset.mode = 'error';
      setMode('error');
    };
    const configure = () => {
      if (nativeMode) return;
      if (!canScrub()) {
        fallback();
        return;
      }
      if (loaded) {
        if (film.readyState >= 2) ready();
        return;
      }
      if (!near) return;
      loaded = true;
      setMode('loading');
      film.preload = 'metadata';
      film.src = src;
      film.load();
      timeout = setTimeout(fallback, 12000);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        near = entries[0]?.isIntersecting ?? false;
        if (near) {
          configure();
          schedule();
        } else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: '700px 0px' },
    );
    film.addEventListener('loadedmetadata', metadata);
    film.addEventListener('loadeddata', ready);
    film.addEventListener('seeked', schedule);
    // loadeddata is not guaranteed after a seek on every browser.
    const decoded = () => {
      if (!active && film.readyState >= 2 && canScrub() && root.dataset.mode !== 'native') ready();
    };
    film.addEventListener('seeked', decoded);
    film.addEventListener('error', failed);
    const nativePlay = () => {
      if (!loaded) {
        loaded = true;
        film.preload = 'metadata';
        film.src = src;
        film.load();
      }
    };
    nativeRequest.current = () => {
      nativePlay();
      void film.play().catch(() => {
        /* Native controls remain available if playback needs another gesture. */
      });
    };
    const resize = new ResizeObserver(() => {
      if (active) {
        measure();
        schedule();
      }
    });
    resize.observe(root);
    resize.observe(document.documentElement);
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', schedule);
    reduced.addEventListener('change', configure);
    desktop.addEventListener('change', configure);
    connection?.addEventListener('change', configure);
    observer.observe(root);
    configure();
    return () => {
      nativeRequest.current = null;
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize?.disconnect();
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', schedule);
      reduced.removeEventListener('change', configure);
      desktop.removeEventListener('change', configure);
      connection?.removeEventListener('change', configure);
      film.removeEventListener('loadedmetadata', metadata);
      film.removeEventListener('loadeddata', ready);
      film.removeEventListener('seeked', schedule);
      film.removeEventListener('seeked', decoded);
      film.removeEventListener('error', failed);
      film.pause();
      film.removeAttribute('src');
      film.load();
      root.removeAttribute('data-mode');
      root.removeAttribute('data-chapter');
    };
  }, [src, fps, chapters.length]);

  return (
    <section
      ref={section}
      className={styles.section}
      data-mode={mode}
      data-chapter="0"
      aria-labelledby="film-title"
    >
      <div ref={pin} className={styles.pin}>
        <div className={styles.heading}>
          <p className="eyebrow">THE WORK, FROM START TO FINISH</p>
          <h2 id="film-title">{title}</h2>
        </div>
        <div className={styles.surface}>
          <div className={styles.backdrop} aria-hidden="true">
            <span>STEMAGH</span>
            <span>SOFTWARE · SOLUTIONS · GROWTH</span>
          </div>
          {src && (
            <video
              ref={video}
              className={styles.video}
              poster={poster}
              preload="none"
              muted
              playsInline
              controls={mode === 'native'}
              aria-label={title}
              aria-describedby="film-description"
            />
          )}
          <div className={styles.shade} aria-hidden="true" />
          <ol className={styles.chapters} id="film-description">
            {chapters.map((chapter, i) => (
              <li key={chapter.title} data-index={i}>
                <span>0{i + 1}</span>
                <h3>{chapter.title}</h3>
                <p>{chapter.body}</p>
              </li>
            ))}
          </ol>
          <div className={styles.track} aria-hidden="true">
            <span />
          </div>
        </div>
        <div className={styles.note}>
          {mode === 'native' && (
            <button type="button" onClick={() => nativeRequest.current?.()}>
              Load and play film ↗
            </button>
          )}
          <span>
            {mode === 'scrub'
              ? 'SCROLL TO EXPLORE · SCROLL BACK TO REVISIT'
              : 'BRIEF → BUILD → HANDOVER'}
          </span>
          {mode === 'loading' && <span role="status">Preparing the film…</span>}
          {mode === 'error' && (
            <span role="status">The film is unavailable. The project steps are shown above.</span>
          )}
          {mode === 'native' && <span>Play the film at your own pace. Sound is off.</span>}
        </div>
      </div>
    </section>
  );
}
