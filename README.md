# silentthreadstudio.com

The website of [Silent Thread](https://silentthreadstudio.com), a game studio and dev-tools Lab from Colombia. Quiet name. Loud worlds.

- `/`: the studio, the founder, the work, the road so far.
- `/games/raccoon-heist`: Raccoon Heist, the first game. One night at the casino, told by scrolling.
- `/about`, `/press`, `/devlog`.

## Stack

[Astro](https://astro.build) (static output), [GSAP](https://gsap.com) with ScrollTrigger, [Lenis](https://lenis.darkroom.engineering) for smooth scroll. Deploys to Vercel (`vercel.json`).

Every page is complete without JavaScript and with `prefers-reduced-motion`: motion is layered on top of the final composed frame, never required to read it.

## Run it

Requires Node 22.22 or newer.

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve dist/
```

## Layout

```
src/
  pages/            one file per route
  layouts/Base.astro  head, meta, structured data, header and footer
  components/       studio components; raccoon-heist/ holds the game page
  data/             page copy and timeline
  lib/              build-time helpers (structured data, GitHub activity)
  scripts/          motion and interactions
  styles/           tokens (from the brand repo) and global styles
public/             images, sprites, icons, robots.txt, llms.txt
```

Design tokens, logo and voice come from the public brand repo: [silentthreadstudio/brand](https://github.com/silentthreadstudio/brand).

## Contributing

This is the studio's own site, so outside pull requests are not accepted. Bug reports are welcome as issues.

## License

See [LICENSE.md](LICENSE.md).
