// Scroll motion for the studio page. Everything here is built from the mark: a line that pays
// out fast and lands soft, a weight that flashes lime for two frames. With reduced motion
// nothing runs and the page is the static final frame.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const FLASH_MS = 33;
const LIME = '#D4FF3A';

const $ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => scope.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(sel));

function smoothScroll() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/** Each section label hangs from a short thread that pays out when the section arrives. */
function sectionThreads() {
  $$('[data-sec] .sec-thread').forEach((t) => {
    gsap.set(t, { '--pay': 0, '--dot': 0 });
    ScrollTrigger.create({
      trigger: t,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.timeline()
          .to(t, { '--pay': 1, duration: 0.7, ease: 'expo.out' })
          .to(t, { '--dot': 1, duration: 0.12, ease: 'power2.out' }, 0.45)
          .call(() => {
            t.classList.add('flash');
            window.setTimeout(() => t.classList.remove('flash'), FLASH_MS);
          }, [], 0.5);
      },
    });
  });
}

function reveals() {
  const rise = (targets: Element[], trigger: Element) =>
    gsap.from(targets, {
      opacity: 0, y: 24, duration: 0.9, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger, start: 'top 85%', once: true },
    });
  $$('[data-reveal]').forEach((el) => rise([el], el));
  $$('[data-reveal-group]').forEach((el) => rise(Array.from(el.children), el));
}

/** Scrolling away from the hero reels the thread up and lets the two lines part. */
function hero() {
  const el = $('.hero');
  if (!el) return;
  const [quiet, loud] = $$('.hero-line', el);
  gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero-thread', { y: '-28vh', ease: 'none' }, 0)
    .to(quiet, { xPercent: -5, ease: 'none' }, 0)
    .to(loud, { xPercent: 7, ease: 'none' }, 0)
    .to(['.hero-label', '.hero-lede', '.hero-links'], { opacity: 0, ease: 'none' }, 0);
}

/** The tile draws itself as it scrolls in: the thread pays out, the weight lands. */
function markTile() {
  const tile = $('.mark-tile');
  const path = $<SVGPathElement>('path', tile ?? document);
  const dot = $<SVGCircleElement>('circle', tile ?? document);
  if (!tile || !path || !dot) return;
  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  gsap.set(dot, { scale: 0, transformOrigin: '50% 50%' });

  let landed = false;
  gsap.timeline({
    scrollTrigger: {
      trigger: tile, start: 'top 80%', end: 'center 45%', scrub: 0.6,
      onUpdate: (self) => {
        if (self.progress > 0.98 && !landed && self.direction === 1) {
          landed = true;
          gsap.set(dot, { attr: { fill: LIME } });
          window.setTimeout(() => gsap.set(dot, { attr: { fill: '#ECE6D6' } }), FLASH_MS);
        }
        if (self.progress < 0.5) landed = false;
      },
    },
  })
    .to(path, { strokeDashoffset: 0, ease: 'power2.out', duration: 0.75 })
    .to(dot, { scale: 1, ease: 'power2.out', duration: 0.25 });
}

/** The principle being read is lit; the others wait. */
function principles() {
  $$('[data-principle]').forEach((li) => {
    ScrollTrigger.create({ trigger: li, start: 'top 55%', end: 'bottom 55%', toggleClass: 'on' });
  });
}

/** The road so far: one thread pays out down the timeline; each beat's weight lands as it passes. */
function road() {
  const track = $('[data-road]');
  const line = $('.road-line', track ?? document);
  if (!track || !line) return;
  const dots = $$('.road-dot', track);
  const year = $('[data-road-year]');
  const icons = $$('.road-icon');
  gsap.set(line, { scaleY: 0 });
  gsap.set(dots, { scale: 0 });
  const lit = new Set<Element>();

  gsap.to(line, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: track, start: 'top 75%', end: 'bottom 55%', scrub: 0.4,
      onUpdate: () => {
        // Where the end of the line is, in the track's own coordinates.
        const lineBox = line.getBoundingClientRect();
        const end = lineBox.bottom;
        dots.forEach((d) => {
          const y = d.getBoundingClientRect().top + d.offsetHeight / 2;
          const reached = end >= y;
          if (reached && !lit.has(d)) {
            lit.add(d);
            gsap.to(d, { scale: 1, duration: 0.3, ease: 'power2.out' });
            d.classList.add('flash');
            window.setTimeout(() => d.classList.remove('flash'), FLASH_MS);
          } else if (!reached && lit.has(d)) {
            lit.delete(d);
            gsap.to(d, { scale: 0, duration: 0.2, ease: 'power2.in' });
          }
        });
        // The aside shows the year and the icon of the last beat the thread has reached.
        const at = dots.reduce((n, d, i) => (lit.has(d) ? i : n), -1);
        if (at < 0) return;
        const when = dots[at].closest<HTMLElement>('[data-when]')?.dataset.when ?? '';
        if (year && when && year.textContent !== when) year.textContent = when;
        icons.forEach((icon, i) => icon.classList.toggle('on', i === at));
      },
    },
  });
}

/** Live Medellín time; the lime dot blinks while the night shift is on (18:00 to 06:00). */
export function initClock() {
  const clock = $('[data-clock]');
  const shift = $('[data-shift]');
  if (!clock) return;
  const tz = clock.dataset.tz ?? 'America/Bogota';
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
  const tick = () => {
    const time = fmt.format(new Date());
    clock.textContent = time;
    if (shift) {
      const hour = Number(time.slice(0, 2));
      const night = hour >= 18 || hour < 6;
      shift.textContent = night ? 'Night shift on' : 'Main thread hours';
      shift.classList.toggle('on', night);
    }
  };
  tick();
  window.setInterval(tick, 15_000);
}

export function initMotion() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('motion');
  gsap.registerPlugin(ScrollTrigger);
  smoothScroll();
  sectionThreads();
  reveals();
  hero();
  road();
  markTile();
  principles();
}
