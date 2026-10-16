import type { ComponentPropsWithoutRef, ElementType } from 'react';

type ContainerProps<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>;

/** Page-width wrapper shared by header, sections and footer. */
export function Container<T extends ElementType = 'div'>({
  as,
  className = '',
  ...props
}: ContainerProps<T>) {
  const Tag: ElementType = as ?? 'div';
  return <Tag className={`mx-auto w-full max-w-page px-gutter ${className}`} {...props} />;
}
