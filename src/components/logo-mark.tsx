/**
 * The StemAGH mark: one stem that forks into two branches (a parent brand
 * supporting products). Three strokes on a 32 grid, so it survives 16 px.
 * Keep in sync with src/app/icon.svg and brand/ (see docs/brand.md).
 */
export function LogoMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M16 27V16" />
      <path d="M16 16 8 7" />
      <path d="M16 16 24 7" />
    </svg>
  );
}
