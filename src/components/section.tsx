import { Container } from './container';

type SectionProps = {
  id?: string;
  tone?: 'default' | 'muted';
  labelledBy?: string;
  children: React.ReactNode;
};

/** Full-width band with consistent vertical rhythm. */
export function Section({ id, tone = 'default', labelledBy, children }: SectionProps) {
  const bg = tone === 'muted' ? 'border-y border-line bg-surface-muted' : '';
  return (
    <section id={id} aria-labelledby={labelledBy} className={`py-16 sm:py-24 ${bg}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="text-sm font-medium tracking-wide text-accent uppercase">{eyebrow}</p>
      )}
      <h2 id={id} className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-lg text-pretty text-ink-muted">{intro}</p>}
    </div>
  );
}
