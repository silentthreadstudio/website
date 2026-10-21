// Intrinsic size of an image in public/, read at build time, so <img> can carry width and height
// and the page doesn't jump while it loads. Animated GIFs report one frame's height.
import { join } from 'node:path';
import sharp from 'sharp';

// Builds run from the project root; import.meta.url points into the bundle, not src/.
const PUBLIC = join(process.cwd(), 'public');
const cache = new Map<string, Promise<{ width: number; height: number } | null>>();

export function imageSize(src: string) {
  if (!src.startsWith('/')) return Promise.resolve(null);
  if (!cache.has(src)) {
    cache.set(src, sharp(PUBLIC + src).metadata()
      .then((m) => (m.width && m.height ? { width: m.width, height: m.pageHeight ?? m.height } : null))
      .catch(() => null));
  }
  return cache.get(src)!;
}
