// Structured data (schema.org JSON-LD) for search engines and answer engines.
// Only facts the site already states; Base.astro adds the studio and site nodes to every page.
import { SITE, SOCIAL, CONTACT_EMAIL } from '../site';
import { FOUNDER, GAME } from '../data/home';

type Node = Record<string, unknown>;

const abs = (path: string) => new URL(path, SITE.url).href;
export const ORG_ID = abs('/#studio');
export const SITE_ID = abs('/#website');
export const FOUNDER_ID = abs('/#founder');

export const studio = (): Node => ({
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE.name,
  url: abs('/'),
  logo: abs('/apple-touch-icon.png'),
  description: SITE.description,
  slogan: 'Quiet name. Loud worlds.',
  email: CONTACT_EMAIL,
  foundingDate: '2026',
  foundingLocation: { '@type': 'Place', name: 'Medellín, Colombia' },
  founder: { '@id': FOUNDER_ID },
  sameAs: SOCIAL.filter((s) => !s.label.startsWith('Founder')).map((s) => s.href),
});

export const website = (): Node => ({
  '@type': 'WebSite',
  '@id': SITE_ID,
  name: SITE.name,
  url: abs('/'),
  inLanguage: 'en',
  publisher: { '@id': ORG_ID },
});

export const founder = (): Node => ({
  '@type': 'Person',
  '@id': FOUNDER_ID,
  name: FOUNDER.name,
  jobTitle: FOUNDER.title,
  worksFor: { '@id': ORG_ID },
  homeLocation: { '@type': 'Place', name: 'Medellín, Colombia' },
  image: abs('/founder/portrait-512.webp'),
  sameAs: FOUNDER.links.map((l) => l.href),
});

export const videoGame = (description: string, image: string): Node => ({
  '@type': 'VideoGame',
  '@id': abs(`${GAME.href}#game`),
  name: GAME.title,
  url: abs(GAME.href),
  description,
  image: abs(image),
  genre: 'Roguelite',
  inLanguage: 'en',
  author: { '@id': ORG_ID },
  publisher: { '@id': ORG_ID },
});

export const breadcrumb = (trail: { name: string; path: string }[]): Node => ({
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((c, i) => ({
    '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path),
  })),
});
