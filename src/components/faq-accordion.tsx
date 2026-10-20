'use client';

import { useState } from 'react';
import type { FaqItem } from '@/content/products';

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <dl className="mt-10 divide-y divide-line">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const id = `faq-answer-${i}`;
        return (
          <div key={item.question} className="py-5">
            <dt>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-start justify-between gap-4 text-left"
              >
                <span className="text-lg font-semibold">{item.question}</span>
                <span
                  aria-hidden
                  className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink-muted transition-transform"
                  style={{ transform: isOpen ? 'rotate(45deg)' : undefined }}
                >
                  +
                </span>
              </button>
            </dt>
            <dd
              id={id}
              className="overflow-hidden transition-all duration-200"
              style={{
                maxHeight: isOpen ? '20rem' : '0',
                opacity: isOpen ? 1 : 0,
              }}
            >
              <p className="mt-3 max-w-3xl pr-10 text-pretty text-ink-muted">{item.answer}</p>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
