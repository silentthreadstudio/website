// Homepage copy: origin, founder, timeline and the work.

import type { RoadIconName } from './road-icons';

export const ORIGIN = [
  'For years I built products for other companies.',
  'At night I built my own games and tools.',
  'Silent Thread is that night work becoming a studio.',
];

export const FOUNDER = {
  name: 'Esteban Estrada',
  title: 'Founder & Director',
  headline: 'Started at sixteen. Still on the night shift.',
  bio: [
    'I got my first job at sixteen, at a startup that threw me into the deep end. No title, no hand-holding: figure it out, ship it, own it. I never stopped.',
    "Since then I've built media and radio apps for a company in Boston, a marketplace on web and mobile, AI products, and payments infrastructure as a senior engineer. All of it with someone else's name on it.",
    'At night I build tools for AI coding agents in the open (Guildhall, Cockpit, mcpx, Hindsight) and games. Silent Thread is where that work finally gets a name.',
  ],
  quote: 'Being senior is a mindset, not a label you wait to be handed.',
  facts: ['Medellín, Colombia', '5+ years shipping', '15+ projects', 'Senior engineer at 22', '4 open-source tools'],
  links: [
    { label: 'codestz.dev', href: 'https://codestz.dev' },
    { label: 'X @Codestz_Dev', href: 'https://x.com/Codestz_Dev' },
    { label: 'GitHub', href: 'https://github.com/Codestz' },
  ],
};

export const ROAD: { when: string; icon: RoadIconName; beat: string }[] = [
  { when: 'Age 16', icon: 'terminal', beat: 'First job, at a startup. Thrown into the deep end.' },
  { when: '2022', icon: 'radio', beat: 'Media and radio apps, web and mobile, for a company in Boston.' },
  { when: '2022–23', icon: 'store', beat: 'A marketplace, built as a web app and a mobile app.' },
  { when: '2023–25', icon: 'nodes', beat: 'AI products: agents, models, data, and the interface on top.' },
  { when: '2026', icon: 'card', beat: 'Senior engineer at 22, on payments infrastructure.' },
  { when: '2026', icon: 'cube', beat: 'Open-sources Guildhall: code repositories as living 3D worlds. A founder in San Francisco builds a Civilization-style film on top of it.' },
  { when: '2026', icon: 'thread', beat: 'Silent Thread. First game: Raccoon Heist.' },
];

export const GAME = {
  title: 'Raccoon Heist',
  line: 'A raccoon wins the worst casino in town. The Rat Mob wants their cut.',
  status: 'Coming to Steam',
  href: '/games/raccoon-heist',
};

export const LAB = {
  highlight: 'Someone took Guildhall and built a film with it.',
  tools: [
    { name: 'Guildhall', line: 'Code repositories as living 3D worlds.', href: 'https://github.com/Codestz/guildhall' },
    { name: 'Cockpit', line: 'Shells that keep running, subagents you can watch, a PR in the terminal.', href: 'https://github.com/Codestz/opencode-cockpit' },
    { name: 'mcpx', line: 'MCP servers as CLI tools, built for AI agents.', href: 'https://github.com/Codestz/mcpx' },
    { name: 'Hindsight', line: 'Claude Code transcripts as interactive visualizations.', href: 'https://github.com/Codestz/claude-hindsight' },
  ],
};

export const NOW = { building: 'Raccoon Heist' };
