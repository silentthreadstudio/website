// The devlog feed. Same rule as the pages: drafts never appear in a production build.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../../site';
import { getPosts, postUrl } from '../../lib/devlog';

export async function GET(context: APIContext) {
  const posts = (await getPosts()).filter((p) => !p.data.draft);
  return rss({
    title: `${SITE.name} devlog`,
    description: 'Notes from the night shift at Silent Thread.',
    site: context.site ?? SITE.url,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: postUrl(p),
      categories: p.data.tags,
    })),
    customData: '<language>en</language>',
  });
}
