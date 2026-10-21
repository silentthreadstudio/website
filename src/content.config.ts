// Devlog posts: Markdown in src/content/devlog, one file per post, the file name is the slug.
// While a post is a draft, pubDate may read "TODO" (read as not set) and cover / coverAlt may hold a
// "TODO: ..." note (shown as a placeholder). A post can't leave draft while any of those are TODO.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { isTodo } from './lib/todo';

/** A frontmatter value the owner hasn't filled in yet ("TODO..." or empty) reads as undefined. */
const pending = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === '' || v == null || isTodo(v) ? undefined : v), schema.optional());

const devlog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/devlog' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string().max(160),
      pubDate: pending(z.coerce.date()),
      updatedDate: pending(z.coerce.date()),
      type: z.enum(['studio', 'devlog', 'notes']),
      tags: z.array(z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'tags are lowercase kebab-case')).default([]),
      game: z.string().optional(),
      number: z.number().int().positive().optional(),
      cover: z.string().optional(),
      coverAlt: z.string().optional(),
      coverLabel: pending(z.enum(['Concept art', 'In development', 'Screenshot'])),
      draft: z.boolean().default(true),
    })
    .superRefine((p, ctx) => {
      const realCover = !!p.cover && !isTodo(p.cover);
      if (realCover && (!p.coverAlt || isTodo(p.coverAlt))) ctx.addIssue({ code: 'custom', path: ['coverAlt'], message: 'coverAlt is required when cover is set' });
      if (p.draft) return;
      if (!p.pubDate) ctx.addIssue({ code: 'custom', path: ['pubDate'], message: 'set pubDate before turning draft off' });
      if (isTodo(p.cover)) ctx.addIssue({ code: 'custom', path: ['cover'], message: 'replace the cover TODO (or remove cover) before turning draft off' });
    }),
});

export const collections = { devlog };
