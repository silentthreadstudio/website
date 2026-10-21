// Devlog queries. Drafts exist only in `astro dev`: production builds never list, render,
// map or syndicate them, so nothing leaks before the owner flips `draft` to false.
import { getCollection, type CollectionEntry } from 'astro:content';
import { isTodo } from './todo';

export type Post = CollectionEntry<'devlog'>;

export const SHOW_DRAFTS = import.meta.env.DEV;

/** Visible posts, newest first; undated drafts sort to the top in dev. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('devlog', (p) => SHOW_DRAFTS || !p.data.draft);
  for (const p of posts) {
    // A published post must not ship a TODO image placeholder.
    if (!p.data.draft && p.body?.includes('](TODO)')) throw new Error(`devlog/${p.id}: replace the TODO images before publishing`);
  }
  const time = (p: Post) => p.data.pubDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
  return posts.sort((a, b) => time(b) - time(a) || (b.data.number ?? 0) - (a.data.number ?? 0));
}

export const postUrl = (p: Post) => `/devlog/${p.id}`;

/** "Raccoon Heist devlog #1", "Studio", "Notes". */
export function kicker(p: Post) {
  const { type, number, game } = p.data;
  if (type === 'devlog') return `${game === 'raccoon-heist' ? 'Raccoon Heist devlog' : 'Devlog'}${number ? ` #${number}` : ''}`;
  return type === 'studio' ? 'Studio' : 'Notes';
}

export const formatDate = (d?: Date) =>
  d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : 'Date not set';

/** The cover as something to render: a real image, a placeholder, or nothing. */
export function cover(p: Post) {
  const { cover: src, coverAlt, coverLabel } = p.data;
  if (!src) return null;
  if (isTodo(src)) return { todo: true as const, what: src.replace(/^TODO:\s*/i, ''), label: coverLabel };
  return { todo: false as const, src, alt: coverAlt ?? '', label: coverLabel };
}
