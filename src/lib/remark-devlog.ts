// Markdown rendering for devlog posts:
// - HTML comments (notes to the owner) never reach the page.
// - An image whose source is still TODO, written as
//   ![TODO: what to capture. Caption: the caption. Label: Concept art](TODO)
//   becomes a labelled placeholder figure instead of a broken image.
// - A real image on its own line, with a title "Caption | Label", becomes a figure with its
//   label (Concept art, In development) on the image and the caption under it.

import { imageSize } from './image-size';

interface Node {
  type: string;
  value?: string;
  url?: string;
  alt?: string | null;
  title?: string | null;
  children?: Node[];
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const isComment = (n: Node) => n.type === 'html' && /^\s*<!--[\s\S]*-->\s*$/.test(n.value ?? '');
const isBlank = (n: Node) => n.type === 'text' && !n.value?.trim();

function placeholder(alt: string): Node {
  const m = alt.match(/^TODO:\s*([\s\S]*?)\s*(?:Caption:\s*([\s\S]*?)\s*)?(?:Label:\s*([\s\S]*?))?\s*$/i);
  const [, what = alt, caption = '', label = ''] = m ?? [];
  return {
    type: 'html',
    value:
      `<figure class="post-fig is-todo">` +
      `<div class="post-ph">${label ? `<span class="post-label">${esc(label)}</span>` : ''}` +
      `<span class="post-ph-note">Image to come</span><span class="post-ph-what">${esc(what)}</span></div>` +
      (caption ? `<figcaption>${esc(caption)}</figcaption>` : '') +
      `</figure>`,
  };
}

function figure(img: Node, size: { width: number; height: number } | null): Node {
  const [caption = '', label = ''] = (img.title ?? '').split('|').map((t) => t.trim());
  const dims = size ? ` width="${size.width}" height="${size.height}"` : '';
  return {
    type: 'html',
    value:
      `<figure class="post-fig"><div class="post-img">` +
      `<img src="${esc(img.url ?? '')}" alt="${esc(img.alt ?? '')}"${dims} loading="lazy" decoding="async" />` +
      (label ? `<span class="post-label">${esc(label)}</span>` : '') +
      `</div>` + (caption ? `<figcaption>${esc(caption)}</figcaption>` : '') + `</figure>`,
  };
}

async function walk(node: Node) {
  if (!node.children) return;
  node.children = await Promise.all(node.children
    .filter((c) => !isComment(c))
    .map(async (c) => {
      // An image alone on its line becomes a figure (or a placeholder while it is TODO).
      if (c.type === 'paragraph' && c.children) {
        const kids = c.children.filter((k) => !isBlank(k) && !isComment(k));
        if (kids.length === 1 && kids[0].type === 'image') {
          if (kids[0].url === 'TODO') return placeholder(kids[0].alt ?? '');
          if (kids[0].title) return figure(kids[0], await imageSize(kids[0].url ?? ''));
        }
      }
      return c;
    }));
  await Promise.all(node.children.map(walk));
}

export function remarkDevlog() {
  return (tree: Node) => walk(tree);
}
