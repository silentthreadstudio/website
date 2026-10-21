// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { remarkDevlog } from './src/lib/remark-devlog';

// Pages that stay out of the sitemap (and carry noindex): error pages, and the devlog until launch.
const UNLISTED = ['/404', '/500', '/devlog'];

// https://astro.build/config
export default defineConfig({
  site: 'https://silentthreadstudio.com',
  // One URL per page: /about, never /about/ (vercel.json serves about.html there).
  trailingSlash: 'never',
  build: {
    format: 'file',
    // Inline page CSS: no render-blocking stylesheet request before first paint.
    inlineStylesheets: 'always',
  },
  markdown: { remarkPlugins: [remarkDevlog] },
  integrations: [
    sitemap({ filter: (page) => !UNLISTED.some((p) => new URL(page).pathname === p) }),
  ],
});
