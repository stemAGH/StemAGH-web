export function scrollProgress(scrollY: number, start: number, distance: number): number {
  if (!Number.isFinite(distance) || distance <= 0) return 0;
  return Math.min(1, Math.max(0, (scrollY - start) / distance));
}

export function videoTime(progress: number, duration: number, fps: number): number {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  // Seeking exactly to duration can produce an ended/black frame in some decoders.
  const lastFrame = Math.max(0, duration - 1 / Math.max(1, fps));
  return Math.min(1, Math.max(0, progress)) * lastFrame;
}
