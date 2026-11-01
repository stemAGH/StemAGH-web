import Image from 'next/image';

export type Screen = 'home' | 'projects' | 'support' | 'referral';

/**
 * A phone frame showing real screens captured from the Aurelia demo (public/showcase).
 * Several screens cross-fade in turn (CSS only; reduced motion shows the first). Decorative:
 * callers wrap it in aria-hidden.
 */
export function Phone({
  screens,
  className = '',
  priority = false,
}: {
  screens: Screen[];
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`phone ${className}`}>
      <div className={screens.length > 1 ? 'phone-screen phone-cycle' : 'phone-screen'}>
        {screens.map((s, i) => (
          <Image
            key={s}
            src={`/showcase/aurelia-${s}.webp`}
            alt=""
            width={600}
            height={1298}
            sizes="(max-width: 960px) 200px, 260px"
            priority={priority && i === 0}
          />
        ))}
      </div>
    </div>
  );
}
