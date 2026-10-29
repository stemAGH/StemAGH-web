import type { Metadata } from 'next';
import { ShowcaseExperience } from '@/components/showcase-experience';

export const metadata: Metadata = {
  title: 'Interactive Application Showcase | StemAGH',
  description:
    'See the possibilities of custom business software with StemAGH. Explore a scrolling concept showcase and experience an interactive live demo.',
  alternates: { canonical: '/showcase' },
};

export default function ShowcasePage() {
  return <ShowcaseExperience />;
}
