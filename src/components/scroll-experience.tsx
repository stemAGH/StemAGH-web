'use client';
import { useEffect, useRef } from 'react';

export function ScrollExperience() {
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    const elements = [
      ...document.querySelectorAll<HTMLElement>(
        '.section-heading, .service-card, .work-meta, .estate-showcase, .process-grid > li, .hosting-section, .faq-list, .studio-cta h2',
      ),
    ];
    const configure = () => {
      observer?.disconnect();
      elements.forEach((el) => el.classList.remove('reveal-pending'));
      if (media.matches) return;
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.remove('reveal-pending');
              observer?.unobserve(entry.target);
            }
          }),
        { threshold: 0.08 },
      );
      elements.forEach((el, index) => {
        el.classList.add('scroll-reveal');
        el.style.setProperty('--reveal-delay', `${(index % 3) * 65}ms`);
        if (el.getBoundingClientRect().top > innerHeight) el.classList.add('reveal-pending');
        observer?.observe(el);
      });
    };
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - innerHeight;
        if (progress.current)
          progress.current.style.transform = `scaleX(${total > 0 ? scrollY / total : 0})`;
      });
    };
    configure();
    update();
    media.addEventListener('change', configure);
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      elements.forEach((el) => el.classList.remove('reveal-pending'));
      media.removeEventListener('change', configure);
      removeEventListener('scroll', update);
      removeEventListener('resize', update);
    };
  }, []);
  return <div ref={progress} className="reading-progress" aria-hidden="true" />;
}
