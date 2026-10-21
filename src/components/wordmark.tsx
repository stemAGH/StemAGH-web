import Image from 'next/image';
import Link from 'next/link';

/** Original owner-supplied logo; CSS frames the artwork without changing the asset. */
export function Wordmark() {
  return (
    <Link href="/" className="brand-logo" aria-label="StemAGH home">
      <Image
        src="/stemagh-logo.jpg"
        alt=""
        width={1280}
        height={640}
        sizes="(max-width: 700px) 222px, 259px"
        className="brand-logo-image"
      />
    </Link>
  );
}
